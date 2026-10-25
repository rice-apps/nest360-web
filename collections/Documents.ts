import fs from 'fs/promises'
import path from 'path'
import { type CollectionBeforeChangeHook, type CollectionConfig, isolateObjectProperty } from 'payload'

import { renderPdfPreview } from '../lib/pdfPreview'

const idOf = (value: unknown) => (value && typeof value === 'object' && 'id' in value ? value.id : value)

// When a PDF is uploaded, save a picture of its first page to Media and link it as the preview.
// Skipped when the editor picks their own preview in the same save.
const generatePdfPreview: CollectionBeforeChangeHook = async ({ data, originalDoc, req }) => {
  const file = req.file
  if (!file || file.mimetype !== 'application/pdf') return data
  if (data.preview && idOf(data.preview) !== idOf(originalDoc?.preview)) return data

  try {
    // Browser uploads to S3 arrive as a temp file instead of in memory
    const pdf = file.data.length ? file.data : await fs.readFile(file.tempFilePath!)
    const jpg = await renderPdfPreview(new Uint8Array(pdf))
    // Same transaction as the upload (a second connection can exhaust the pool), with its own req.file
    // so the image doesn't replace the PDF being uploaded
    const preview = await req.payload.create({
      req: isolateObjectProperty(req, 'file'),
      collection: 'media',
      data: { alt: `First page of ${file.name}` },
      file: {
        data: jpg,
        mimetype: 'image/jpeg',
        name: `${path.parse(file.name).name}-preview.jpg`,
        size: jpg.length,
      },
    })
    return { ...data, preview: preview.id }
  } catch (error) {
    // A PDF that can't be rendered still uploads, just without a preview
    req.payload.logger.warn({ err: error, msg: `Could not make a preview for ${file.name}` })
    return data
  }
}

// Downloadable files such as job aids, care modules, guides, templates and data tools
export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'filename',
  },
  // Public can read; creating, editing and deleting require login (Payload's default)
  access: {
    read: () => true,
  },
  upload: {
    // Every file type linked from nest360.org project pages
    mimeTypes: [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'video/mp4',
    ],
  },
  hooks: {
    beforeChange: [generatePdfPreview],
  },
  fields: [
    {
      name: 'preview',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Made automatically from the first page when a PDF is uploaded. Replace it to use a different picture.',
      },
    },
  ],
}
