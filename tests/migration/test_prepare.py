import importlib.util
import ssl
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location("prepare", Path(__file__).parents[2] / "scripts/migration/prepare.py")
prepare = importlib.util.module_from_spec(spec)
spec.loader.exec_module(prepare)


class ExtractionTests(unittest.TestCase):
    def test_tls_keeps_certificate_and_hostname_verification_enabled(self):
        context = prepare.tls_context()
        self.assertEqual(context.verify_mode, ssl.CERT_REQUIRED)
        self.assertTrue(context.check_hostname)
        self.assertTrue(context.get_ca_certs())

    def test_extracts_intro_and_distinguishes_language_links(self):
        source = {"url": "https://nest360.org/project/example/", "title": "Clinical Job Aids", "resources": [
            {"linkText": "Canta", "language": "en"}, {"linkText": "Canta", "language": "pt"},
        ]}
        html = '''<nav>Do not import navigation</nav><h1>Clinical Job Aids</h1>
        <p>Original <strong>description</strong> &amp; context.</p><a href="#files">Download below</a>
        <h4>Oxygen Concentrator</h4><a href="/uploads/canta.pdf">Canta</a>
        <a href="/uploads/canta.pdf">Canta</a><a href="/uploads/canta_PT-Final.pdf">Canta</a>
        <p>Do not import footer</p>'''
        result = prepare.extract(html, source)
        self.assertEqual(result["description"], ["Original description & context."])
        self.assertEqual(result["resources"][0]["fileUrl"], "https://nest360.org/uploads/canta.pdf")
        self.assertEqual(result["resources"][1]["fileUrl"], "https://nest360.org/uploads/canta_PT-Final.pdf")

    def test_missing_or_ambiguous_link_fails_for_review(self):
        source = {"url": "https://nest360.org/project/example/", "title": "Example", "resources": [
            {"linkText": "Guide", "language": "en"},
        ]}
        for links in ['', '<a href="a.pdf">Guide</a><a href="b.pdf">Guide</a>']:
            with self.assertRaises(ValueError):
                prepare.extract('<h1>Example</h1><p>Description</p>' + links, source)

    def test_changed_page_heading_fails_instead_of_importing_navigation(self):
        with self.assertRaises(ValueError):
            prepare.extract('<h1>Wrong page</h1><p>Text</p>', {"url": "https://nest360.org/", "title": "Expected"})


if __name__ == '__main__':
    unittest.main()
