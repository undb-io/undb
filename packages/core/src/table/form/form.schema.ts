import { z } from 'zod'
import { fieldIdSchema } from '../field/index.js'
import { formFields } from './form-fields.vo.js'
import { formIdSchema } from './form-id.vo.js'
import { formNameSchema } from './form-name.vo.js'

export const createFormSchema = z.object({
  id: formIdSchema.optional(),
  name: formNameSchema,
  fields: formFields.optional(),
})
export type ICreateFormSchema = z.infer<typeof createFormSchema>

export const createFormsSchema = z.array(createFormSchema)
export type ICreateFormsSchema = z.infer<typeof createFormsSchema>

export const queryForm = z.object({
  id: formIdSchema,
  name: formNameSchema,
  fields: formFields,
})
export const queryForms = z.array(queryForm)

const formFieldOptionBaseSchema = z.object({
  formId: formIdSchema,
})

export const setFormFieldVisibilitySchema = z
  .object({
    visibility: z.record(fieldIdSchema, z.boolean()),
  })
  .merge(formFieldOptionBaseSchema)

export type ISetFormFieldVisibilitySchema = z.infer<typeof setFormFieldVisibilitySchema>