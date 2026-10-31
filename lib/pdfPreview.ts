import path from 'path'
import sharp from 'sharp'

// pdfjs reads its fonts and character maps from disk in Node; next.config.ts ships these folders.
// Built from the project root because bundlers rewrite require.resolve into module IDs.
const pdfjsDir = path.join(process.cwd(), 'node_modules', 'pdfjs-dist')

const PREVIEW_WIDTH = 600

type CanvasFactory = {
  create: (
    width: number,
    height: number,
  ) => { canvas: { toBuffer: (type: 'image/png') => Buffer }; context: CanvasRenderingContext2D }
}

// pdfjs refuses to run if Array.prototype has enumerable extras. drizzle-kit, which Payload loads in
// development to push schema changes, adds an enumerable `random`. Keep it, but make it non-enumerable.
function hideEnumerableArrayExtras() {
  for (const key of Object.keys(Array.prototype)) {
    Object.defineProperty(Array.prototype, key, { enumerable: false })
  }
}

// Renders the first page of a PDF as a JPEG, used as the document's preview picture
export async function renderPdfPreview(pdf: Uint8Array): Promise<Buffer> {
  hideEnumerableArrayExtras()
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const loadingTask = getDocument({
    data: pdf,
    cMapUrl: `${path.join(pdfjsDir, 'cmaps')}/`,
    standardFontDataUrl: `${path.join(pdfjsDir, 'standard_fonts')}/`,
    wasmUrl: `${path.join(pdfjsDir, 'wasm')}/`,
  })

  try {
    const doc = await loadingTask.promise
    const page = await doc.getPage(1)
    const viewport = page.getViewport({ scale: PREVIEW_WIDTH / page.getViewport({ scale: 1 }).width })
    // In Node, pdfjs creates canvases with @napi-rs/canvas
    const { canvas, context } = (doc.canvasFactory as CanvasFactory).create(
      Math.ceil(viewport.width),
      Math.ceil(viewport.height),
    )
    await page.render({ canvas: null, canvasContext: context, viewport }).promise
    return await sharp(canvas.toBuffer('image/png')).flatten({ background: '#ffffff' }).jpeg({ quality: 80 }).toBuffer()
  } finally {
    await loadingTask.destroy()
  }
}
