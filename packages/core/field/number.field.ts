import * as z from 'zod'
import { BaseField, baseFieldQuerySchema, createBaseFieldsSchema } from './field.base'
import type { INumberField } from './field.type'
import { FieldId, FieldName, FieldValueConstraints } from './value-objects'

export const numberTypeSchema = z.literal('number')
export type NumberType = z.infer<typeof numberTypeSchema>

export const createNumberFieldSchema = createBaseFieldsSchema.merge(z.object({ type: numberTypeSchema }))

export type ICreateNumberFieldInput = z.infer<typeof createNumberFieldSchema>

export const numberFieldQuerySchema = baseFieldQuerySchema.merge(z.object({ type: numberTypeSchema }))

export const numberFieldValue = z.number()
export type NumberFieldValue = z.infer<typeof numberFieldValue>

export class NumberField extends BaseField<INumberField> {
  get type(): NumberType {
    return 'number'
  }

  static create(input: ICreateNumberFieldInput): NumberField {
    return new NumberField({
      id: FieldId.from(input.id),
      name: FieldName.create(input.name),
      valueConstrains: FieldValueConstraints.create({ required: input.required }),
    })
  }

  static unsafeCreate(input: ICreateNumberFieldInput): NumberField {
    return new NumberField({
      id: FieldId.from(input.id),
      name: FieldName.unsafaCreate(input.name),
      valueConstrains: FieldValueConstraints.unsafeCreate({ required: input.required }),
    })
  }
}
