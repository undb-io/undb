import { ValueObject } from "@undb/domain"
import type { Field } from "../.."
import type { TableDo } from "../../../table.do"
import type { SchemaMap } from "../../schema/schema.type"
import { FormFieldVO } from "./form-field.vo"

export class FormFieldsVO extends ValueObject<FormFieldVO[]> {
  static create(table: TableDo) {
    const fields = table.getOrderedMutableFields()
    return new FormFieldsVO(fields.map((field) => FormFieldVO.create(field)))
  }

  public addField(field: Field) {
    return new FormFieldsVO([...this.props, FormFieldVO.create(field)])
  }

  public deleteField(field: Field) {
    return new FormFieldsVO(this.props.filter((formField) => formField.fieldId !== field.id.value))
  }

  public getPreviousFields(fieldId: string): FormFieldVO[] {
    const fields = this.props
    const index = fields.findIndex((field) => field.fieldId === fieldId)
    if (index === -1 || index === 0) {
      return []
    }
    return fields.slice(0, index)
  }

  public getNextFields(fieldId: string): FormFieldVO[] {
    const fields = this.props
    const index = fields.findIndex((field) => field.fieldId === fieldId)
    if (index === -1 || index === fields.length - 1) {
      return []
    }
    return fields.slice(index + 1)
  }

  public toggleFieldVisibility(schema: SchemaMap): FormFieldsVO {
    return new FormFieldsVO(
      this.props.map((formField) => {
        const field = schema.get(formField.fieldId)
        return field ? formField.toggleVisibility(field) : formField
      }),
    )
  }

  public show(schema: SchemaMap): FormFieldsVO {
    return new FormFieldsVO(
      this.props.map((formField) => {
        const field = schema.get(formField.fieldId)
        return field ? formField.show(field) : formField
      }),
    )
  }

  public hide(schema: SchemaMap): FormFieldsVO {
    return new FormFieldsVO(
      this.props.map((formField) => {
        const field = schema.get(formField.fieldId)
        return field ? formField.hide(field) : formField
      }),
    )
  }

  toJSON() {
    return this.props.map((field) => field.toJSON())
  }
}
