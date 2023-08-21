import { ValueObject, and } from '@undb/domain'
import { isString, sortBy } from 'lodash-es'
import type { Option } from 'oxide.ts'
import type { Field } from '../field/field.type.js'
import type { IRootFilter } from '../filter/filter.js'
import type { TableCompositeSpecification } from '../specifications/interface.js'
import type { TableSchema } from '../value-objects/index.js'
import type { ViewVO } from '../view/index.js'
import { FormFieldsOrder } from './form-fields-order.vo.js'
import { FormFields } from './form-fields.vo.js'
import { FormId } from './form-id.vo.js'
import { FormName } from './form-name.vo.js'
import type { ICreateFormBaseSchema, ICreateFormSchema, IUpdateFormSchema } from './form.schema.js'
import type { IForm } from './form.type.js'
import { WithFormFieldFilter } from './specifications/form-field-filter.specification.js'
import { WithFormFieldsOrder } from './specifications/form-fields-order.specification.js'
import { WithFormFieldsRequirements, WithFormFieldsVisibility } from './specifications/form-fields.specification.js'
import { WithFormName } from './specifications/form-name.specification.js'

export class Form extends ValueObject<IForm> {
  public get id() {
    return this.props.id
  }

  public get name() {
    return this.props.name
  }

  public set name(name: FormName) {
    this.props.name = name
  }

  public get fields() {
    return this.props.fields
  }

  public set fields(fields: FormFields) {
    this.props.fields = fields
  }

  public get fieldsOrder() {
    return this.props.fieldsOrder
  }

  public set fieldsOrder(fields: FormFieldsOrder | undefined) {
    this.props.fieldsOrder = fields
  }

  public getOrderedField(schema: TableSchema): FormFieldsOrder {
    if (this.fieldsOrder) return this.fieldsOrder
    const order = schema.fields.filter((f) => !f.controlled).map((f) => f.id.value)
    return new FormFieldsOrder(order)
  }

  private getOrderedFieldIds(schema: TableSchema): string[] {
    return this.fieldsOrder?.order ?? schema.fields.filter((f) => !f.controlled).map((f) => f.id.value)
  }

  public getHiddenFields(schema: TableSchema): Field[] {
    const fields: Field[] = []

    for (const field of schema.fields) {
      if (field.controlled) continue

      const hidden = this.fields.value.get(field.id.value)?.hidden
      if (hidden) {
        fields.push(field)
      }
    }

    return fields
  }

  public getNotHiddenFields(schema: TableSchema): Field[] {
    const fields: Field[] = []

    for (const field of schema.fields) {
      if (field.controlled) continue

      const hidden = this.fields.value.get(field.id.value)?.hidden
      if (!hidden) {
        fields.push(field)
      }
    }

    const order = this.getOrderedFieldIds(schema)
    return sortBy(fields, (f) => order.indexOf(f.id.value))
  }

  public setFormFieldsOrder(schema: TableSchema, fieldsOrder: string[]): TableCompositeSpecification {
    const notHiddenFields = this.getNotHiddenFields(schema)
    const notHiddenFieldIds = new Set(notHiddenFields.map((f) => f.id.value))
    const order = fieldsOrder.filter((id) => notHiddenFieldIds.has(id))

    return new WithFormFieldsOrder(this.id.value, new FormFieldsOrder(order))
  }

  public static fromView(input: Partial<ICreateFormBaseSchema>, view: ViewVO, schema: TableSchema): Form {
    return this.create(
      {
        ...input,
        name: input.name ?? view.name.value,
        fields: FormFields.fromViewFields(schema, view.fieldOptions).toJSON(),
        fieldsOrder: view.fieldsOrder?.order,
      },
      schema,
    )
  }

  public static create(input: ICreateFormSchema, schema: TableSchema): Form {
    return new this({
      id: FormId.fromNullableString(input.id),
      name: FormName.create(input.name),
      fields: FormFields.from(schema, input.fields),
      fieldsOrder: input.fieldsOrder ? new FormFieldsOrder(input.fieldsOrder) : undefined,
    })
  }

  public static unsafeCreate(input: ICreateFormSchema): Form {
    return new this({
      id: FormId.fromNullableString(input.id),
      name: FormName.create(input.name),
      fields: FormFields.unsafeFrom(input.fields ?? {}),
      fieldsOrder: input.fieldsOrder ? new FormFieldsOrder(input.fieldsOrder) : undefined,
    })
  }

  public setFieldVisibility(visiblity: Record<string, boolean>): TableCompositeSpecification {
    return new WithFormFieldsVisibility(this.id.value, visiblity)
  }

  public setFieldRequirements(requirements: Record<string, boolean>): TableCompositeSpecification {
    return new WithFormFieldsRequirements(this.id.value, requirements)
  }

  public setFieldFilter(fieldId: string, filter: IRootFilter): TableCompositeSpecification {
    return new WithFormFieldFilter(this.id.value, fieldId, filter)
  }

  public update(input: IUpdateFormSchema): Option<TableCompositeSpecification> {
    const specs: TableCompositeSpecification[] = []

    if (isString(input.name)) {
      specs.push(new WithFormName(this.id.value, new FormName({ value: input.name })))
    }

    return and(...specs)
  }
}
