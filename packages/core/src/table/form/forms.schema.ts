import { z } from 'zod'
import { formIdSchema } from './form-id.vo'

export const createFormSchema = z.object({
  id: formIdSchema.optional(),
})
export type ICreateFormSchema = z.infer<typeof createFormSchema>

export const createFormsSchema = z.array(createFormSchema)
export type ICreateFormsSchema = z.infer<typeof createFormsSchema>

export const queryForm = z.object({
  id: formIdSchema,
})
export const queryForms = z.array(queryForm)
