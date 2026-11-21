import { Zip, ZipPassThrough } from 'fflate';

// "Download all" on project and technology pages: one .zip of every file the page lists.
// Each file is read through its own Payload URL (so it works with local uploads and with S3) and streamed into
// the zip as it arrives, so nothing is held in memory or saved on the server. Files are stored uncompressed:
// PDFs and Office files are already compressed, so compressing again would only make the download slower.
// `slug` names the zip, e.g. syringe-pump.zip
export function zipResponse(request: Request, slug: string, files: { url: string; filename: string }[]) {
  if (!files.length) return new Response('No files to download.', { status: 404 });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const zip = new Zip((error, chunk, final) => {
        if (error) return controller.error(error);
        controller.enqueue(chunk);
        if (final) controller.close();
      });

      try {
        const names = new Set<string>();
        for (const file of files) {
          const response = await fetch(new URL(file.url, request.url));
          if (!response.ok || !response.body) throw new Error(`Could not read ${file.filename} (${response.status})`);

          const entry = new ZipPassThrough(uniqueName(file.filename, names));
          zip.add(entry);
          const reader = response.body.getReader();
          for (let part = await reader.read(); !part.done; part = await reader.read()) entry.push(part.value);
          entry.push(new Uint8Array(0), true);
        }
        zip.end();
      } catch (error) {
        // Ends the download as failed rather than handing over a zip with files missing
        zip.terminate();
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${slug}.zip"`,
      'Cache-Control': 'no-store',
    },
  });
}

// Two files can share a name (e.g. from different uploads), so the second becomes "name (2).pdf"
function uniqueName(filename: string, used: Set<string>) {
  const dot = filename.lastIndexOf('.');
  const [base, extension] = dot > 0 ? [filename.slice(0, dot), filename.slice(dot)] : [filename, ''];
  let name = filename;
  for (let count = 2; used.has(name.toLowerCase()); count++) name = `${base} (${count})${extension}`;
  used.add(name.toLowerCase());
  return name;
}
