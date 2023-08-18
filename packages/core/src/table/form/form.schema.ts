import { z } from 'zod'
import { fieldIdSchema } from '../field/index.js'
import { formFields } from './form-fields.vo.js'
import { formIdSchema } from './form-id.vo.js'
import { formNameSchema } from './form-name.vo.js'

export const createFormBaseSchema = z.object({
  id: formIdSchema.optional(),
  name: formNameSchema,
})

export type ICreateFormBaseSchema = z.infer<typeof createFormBaseSchema>

export const createFormSchema = z
  .object({
    fields: formFields.optional(),
    fieldsOrder: fieldIdSchema.array().optional(),
  })
  .merge(createFormBaseSchema)

export type ICreateFormSchema = z.infer<typeof createFormSchema>

export const updateFormSchema = z
  .object({
    name: formNameSchema,
  })
  .partial()
export type IUpdateFormSchema = z.infer<typeof updateFormSchema>

export const createFormsSchema = z.array(createFormSchema)
export type ICreateFormsSchema = z.infer<typeof createFormsSchema>

export const queryForm = z.object({
  id: formIdSchema,
  name: formNameSchema,
  fields: formFields,
  fieldsOrder: fieldIdSchema.array().optional(),
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

export const setFormFieldRequirementsSchema = z
  .object({
    requirements: z.record(fieldIdSchema, z.boolean()),
  })
  .merge(formFieldOptionBaseSchema)

export type ISetFormFieldRequirementsSchema = z.infer<typeof setFormFieldRequirementsSchema>

export const setFormFieldFilterSchema = z
  .object({
    fieldId: fieldIdSchema,
    filter: z.any().nullable(),
  })
  .merge(formFieldOptionBaseSchema)

export type ISetFormFieldFilterSchema = z.infer<typeof setFormFieldFilterSchema>

export const setFormFieldsOrderSchema = z.object({
  formId: formIdSchema,
  fieldsOrder: fieldIdSchema.array(),
})

export type ISetFormFieldsOrderSchema = z.infer<typeof setFormFieldsOrderSchema>
