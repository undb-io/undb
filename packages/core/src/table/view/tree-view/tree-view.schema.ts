import { z } from 'zod'
import { TreeField } from '../../field/index.js'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema.js'

export const treeViewSchema = z.object({
  fieldId: fieldIdSchema.optional(),
})

export const treeViewField = z.instanceof(TreeField)

export type ITreeViewField = z.infer<typeof treeViewField>

export type ITreeViewSchema = z.infer<typeof treeViewSchema>
