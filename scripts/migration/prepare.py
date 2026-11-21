"""Extract a reviewed sample of WordPress links and cache the original PDFs. Standard library only."""
import hashlib
import json
import os
import re
import ssl
import sys
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
CACHE = ROOT / ".migration-poc"
MAX_BYTES = 30 * 1024 * 1024


def text(value):
    return re.sub(r"\s+", " ", value).strip()


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.events, self.active = [], []
        self.position = 0

    def handle_starttag(self, tag, attrs):
        self.position += 1
        if tag in {"a", "p", "h1", "h2", "h3", "h4", "h5", "h6"}:
            self.active.append([tag, dict(attrs), [], self.position])

    def handle_data(self, data):
        for item in self.active:
            item[2].append(data)

    def handle_endtag(self, tag):
        for index in range(len(self.active) - 1, -1, -1):
            if self.active[index][0] == tag:
                item = self.active.pop(index)
                self.events.append((item[3], tag, text("".join(item[2])), item[1]))
                break


def extract(html, source):
    parser = PageParser()
    parser.feed(html)
    events = sorted(parser.events)
    start = next((i for i, event in enumerate(events)
                  if event[1].startswith("h") and event[2] == source["title"]), None)
    if start is None:
        raise ValueError(f"Page heading changed: {source['url']}; review the source plan.")
    paragraphs, links = [], []
    in_intro = True
    for _, tag, label, attrs in events[start + 1:]:
        if tag.startswith("h"):
            in_intro = False
        if tag == "p" and in_intro and label and not label.lower().startswith("download"):
            paragraphs.append(label)
        if tag == "a" and attrs.get("href"):
            links.append((label, urljoin(source["url"], attrs["href"])))
            if label.lower().startswith("download"):
                in_intro = False
    if not paragraphs:
        raise ValueError(f"No introduction extracted: {source['url']}; review before importing.")
    resources = []
    for selection in source["resources"]:
        matches = list(dict.fromkeys(url for label, url in links if label == selection["linkText"]))
        # English/Portuguese links share visible labels. Resolve only the documented filename convention.
        if len(matches) > 1:
            matches = [url for url in matches
                       if bool(re.search(r"(?:_|-)PT(?:_|-)", url, re.I)) == (selection["language"] == "pt")]
        if len(matches) != 1:
            raise ValueError(f"Expected one {selection['linkText']} ({selection['language']}) link; got {matches}")
        resources.append({**selection, "fileUrl": matches[0]})
    return {**source, "description": paragraphs, "resources": resources}


def download(url):
    if urlparse(url).scheme != "https" or urlparse(url).hostname not in {"nest360.org", "www.nest360.org"}:
        raise ValueError(f"Unexpected source host: {url}")
    context = tls_context()
    with urlopen(Request(url, headers={"User-Agent": "NEST360-Migration-PoC/1.0"}), timeout=45, context=context) as response:
        if urlparse(response.url).scheme != "https" or urlparse(response.url).hostname not in {"nest360.org", "www.nest360.org"}:
            raise ValueError(f"Unexpected redirect: {response.url}")
        data = response.read(MAX_BYTES + 1)
        if len(data) > MAX_BYTES:
            raise ValueError(f"Source exceeds 30 MB: {url}")
        return data


def tls_context():
    context = ssl.create_default_context()
    # python.org's macOS installer may have no default CA file until its certificate setup is run.
    # Use the operating system's CA bundle in that case; never disable HTTPS verification.
    if (sys.platform == "darwin" and not context.get_ca_certs()
            and not os.environ.get("SSL_CERT_FILE") and not os.environ.get("SSL_CERT_DIR")):
        bundle = Path("/etc/ssl/cert.pem")
        if bundle.is_file():
            context.load_verify_locations(cafile=str(bundle))
    return context


def prepare():
    sources = json.loads((Path(__file__).with_name("sources.json")).read_text())
    CACHE.mkdir(exist_ok=True)
    (CACHE / "downloads").mkdir(exist_ok=True)
    projects = []
    for source in sources:
        print(f"Extracting {source['url']}")
        page = download(source["url"]).decode("utf-8")
        project = extract(page, source)
        for resource in project["resources"]:
            pdf = download(resource["fileUrl"])
            if not pdf.startswith(b"%PDF-"):
                raise ValueError(f"Not a PDF: {resource['fileUrl']}; nothing imported.")
            digest = hashlib.sha256(pdf).hexdigest()
            relative = f"downloads/{digest}.pdf"
            (CACHE / relative).write_bytes(pdf)
            resource.update({"file": relative, "sha256": digest})
        projects.append(project)
    manifest = {"version": 1, "retrievedAt": datetime.now(timezone.utc).isoformat(), "projects": projects}
    # Publish a manifest only after every selected link/file has been validated.
    temporary = CACHE / "manifest.tmp.json"
    temporary.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n")
    temporary.replace(CACHE / "manifest.json")
    print(f"Prepared {sum(len(p['resources']) for p in projects)} PDFs. Review {CACHE / 'manifest.json'} before import.")


if __name__ == "__main__":
    try:
        prepare()
    except Exception as error:
        print(f"Preparation failed: {error}", file=sys.stderr)
        sys.exit(1)
