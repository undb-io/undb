import { ValueObject } from '@undb/domain'
import { merge } from 'lodash-es'
import { z } from 'zod'
import type { Field } from '../field'
import type { TableSchema } from '../value-objects'

export const formField = z.object({
  hidden: z.boolean().optional(),
  required: z.boolean(),
})

export type IFormField = z.infer<typeof formField>

export const formFields = z.record(z.string(), formField)

export type IFormFields = z.infer<typeof formFields>

export class FormFields extends ValueObject<Map<string, IFormField>> {
  public static getDefault(field: Field): IFormField {
    return {
      hidden: false,
      required: field.required,
    }
  }

  static default(schema: TableSchema) {
    const fields: IFormFields = {}

    for (const field of schema.fields) {
      fields[field.id.value] = FormFields.getDefault(field)
    }

    return new this(new Map(Object.entries(fields)))
  }

  static from(schema: TableSchema, input?: IFormFields) {
    if (!input) return this.default(schema)
    const formFields = new Map<string, IFormField>()

    for (const [fieldId, option] of Object.entries(input)) {
      const field = schema.getFieldById(fieldId).into()
      if (!field) continue
      formFields.set(fieldId, {
        required: field.required ? true : option.required,
        hidden: field.required ? false : !!option.hidden,
      })
    }

    return input ? new this(formFields) : this.default(schema)
  }

  static unsafeFrom(input: IFormFields) {
    return new this(new Map(Object.entries(input)))
  }

  public get value() {
    return this.props
  }

  public toJSON() {
    return Object.fromEntries(this.value)
  }

  *[Symbol.iterator]() {
    yield* Object.entries(this.toJSON)
  }

  public isRequired(fieldId: string) {
    return !!this.value.get(fieldId)?.required
  }

  public merge(schema: TableSchema, visibility: Record<string, boolean>) {
    return FormFields.from(schema, merge(this.toJSON(), visibility))
  }
}
