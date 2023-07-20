import { z } from 'zod'
import { AttachmentField } from '../../field/index.js'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema.js'

export const gallerySchema = z.object({
  fieldId: fieldIdSchema.optional(),
})

export const galleryField = z.instanceof(AttachmentField)

export type IGalleryField = z.infer<typeof galleryField>

export type IGallerySchema = z.infer<typeof gallerySchema>
