import * as z from 'zod'
import { BaseField, baseFieldQuerySchema, createBaseFieldsSchema } from './field.base'
import type { ITextField } from './field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export const textTypeSchema = z.literal('text')
export type TextFieldType = z.infer<typeof textTypeSchema>

export const textFieldValue = z.string()
export type TextFieldValue = z.infer<typeof textFieldValue>

export const createTextFieldSchema = createBaseFieldsSchema.merge(
  z.object({
    type: textTypeSchema,
  }),
)

export type ICreateTextFieldInput = z.infer<typeof createTextFieldSchema>

export const textFieldQuerySchema = baseFieldQuerySchema.merge(z.object({ type: textTypeSchema }))

export class TextField extends BaseField<ITextField> {
  get type(): TextFieldType {
    return 'text'
  }

  static create(input: ICreateTextFieldInput): TextField {
    return new TextField({
      id: FieldId.from(input.id),
      name: FieldName.create(input.name),
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateTextFieldInput): TextField {
    return new TextField({
      id: FieldId.from(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
  }
}
