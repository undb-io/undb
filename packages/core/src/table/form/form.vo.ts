import { ValueObject } from '@undb/domain'
import type { Field } from '../field/field.type.js'
import type { TableCompositeSpecification } from '../specifications/interface.js'
import type { TableSchema, TableSchemaIdMap } from '../value-objects/index.js'
import { FormFields } from './form-fields.vo.js'
import { FormId } from './form-id.vo.js'
import { FormName } from './form-name.vo.js'
import type { ICreateFormSchema } from './form.schema.js'
import type { IForm } from './form.type.js'
import { WithFormFieldsVisibility } from './specifications/form-fields.specification.js'

export class Form extends ValueObject<IForm> {
  public get id() {
    return this.props.id
  }

  public get name() {
    return this.props.name
  }

  public get fields() {
    return this.props.fields
  }

  public set fields(fields: FormFields) {
    this.props.fields = fields
  }

  public getHiddenFields(schema: TableSchemaIdMap): Field[] {
    const fields: Field[] = []

    for (const [fieldId, formField] of this.fields) {
      const field = schema.get(fieldId)
      if (!!field && !field.controlled && formField.hidden) {
        fields.push(field)
      }
    }

    return fields
  }
  public getNotHiddenFields(schema: TableSchemaIdMap): Field[] {
    const fields: Field[] = []

    for (const [fieldId, field] of schema) {
      if (field.controlled) continue

      const hidden = this.fields.value.get(fieldId)?.hidden
      if (!hidden) {
        fields.push(field)
      }
    }

    return fields
  }

  public static create(input: ICreateFormSchema, schema: TableSchema): Form {
    return new this({
      id: FormId.fromNullableString(input.id),
      name: FormName.create(input.name),
      fields: FormFields.from(schema, input.fields),
    })
  }

  public static unsafeCreate(input: ICreateFormSchema): Form {
    return new this({
      id: FormId.fromNullableString(input.id),
      name: FormName.create(input.name),
      fields: FormFields.unsafeFrom(input.fields ?? {}),
    })
  }

  public setFieldVisibility(visiblity: Record<string, boolean>): TableCompositeSpecification {
    return new WithFormFieldsVisibility(this.id.value, visiblity)
  }
}
