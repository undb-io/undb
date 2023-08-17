import { ValueObject } from '@undb/domain'
import { merge } from 'lodash-es'
import { z } from 'zod'
import type { TableSchema } from '../value-objects/index.js'
import type { ViewFieldOptions } from '../view/index.js'
import type { IFormField } from './form-field.vo.js'
import { FormField, formField } from './form-field.vo.js'

export const formFields = z.record(z.string(), formField)

export type IFormFields = z.infer<typeof formFields>

export class FormFields extends ValueObject<Map<string, FormField>> {
  static default(schema: TableSchema) {
    const fields: Record<string, FormField> = {}

    for (const field of schema.fields) {
      fields[field.id.value] = FormField.getDefault(field)
    }

    return new this(new Map(Object.entries(fields)))
  }

  static fromViewFields(schema: TableSchema, viewFields: ViewFieldOptions): FormFields {
    const fields: IFormFields = {}

    for (const [fieldId, option] of viewFields) {
      fields[fieldId] = { required: false, hidden: option.hidden, filter: null }
    }

    return this.from(schema)
  }

  static from(schema: TableSchema, input?: IFormFields) {
    if (!input) return this.default(schema)
    const formFields = new Map<string, FormField>()

    for (const [fieldId, option] of Object.entries(input)) {
      const field = schema.getFieldById(fieldId).into()
      if (!field) continue
      formFields.set(
        fieldId,
        new FormField({
          required: field.required ? true : option.required,
          hidden: field.required ? false : !!option.hidden,
          filter: option.filter,
        }),
      )
    }

    return input ? new this(formFields) : this.default(schema)
  }

  static unsafeFrom(input: IFormFields) {
    return new this(new Map(Object.entries(input).map(([key, value]) => [key, new FormField(value)])))
  }

  public get value() {
    return this.props
  }

  public toJSON() {
    const result: Record<string, IFormField> = {}
    for (const [key, value] of this.value) {
      result[key] = value.unpack()
    }
    return result
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
