import { Option, ValueObject } from "@undb/domain"
import type { TableDo } from "../../../table.do"
import type { Field } from "../../schema/fields/field.type"
import type { SchemaIdMap } from "../../schema/schema.type"
import { FormFieldVO, type ICreateFormField } from "./form-field.vo"

export class FormFieldsVO extends ValueObject<FormFieldVO[]> {
  static create(table: TableDo, formFields?: ICreateFormField[]) {
    const fields = table.getOrderedMutableFields()

    if (!formFields) {
      return new FormFieldsVO(fields.map((field) => FormFieldVO.create(field)))
    }

    const formFieldsMap = new Map(formFields.map((formField) => [formField.fieldId, formField]))

    return new FormFieldsVO(
      fields.map((field) => FormFieldVO.create(field, formFieldsMap.get(field.id.value) ?? { hidden: true })),
    )
  }

  public addField(field: Field, hidden = false) {
    return new FormFieldsVO([...this.props, FormFieldVO.create(field, { hidden })])
  }

  public deleteField(field: Field) {
    return new FormFieldsVO(
      this.props
        .filter((formField) => formField.fieldId !== field.id.value)
        .map((formField) => formField.deleteField(field)),
    )
  }

  public getPreviousFields(fieldId: string): FormFieldVO[] {
    const fields = this.props
    const index = fields.findIndex((field) => field.fieldId === fieldId)
    if (index === -1 || index === 0) {
      return []
    }
    return fields.slice(0, index)
  }

  public getFormField(fieldId: string): Option<FormFieldVO> {
    return Option(this.props.find((field) => field.fieldId === fieldId))
  }

  public getNextFields(fieldId: string): FormFieldVO[] {
    const fields = this.props
    const index = fields.findIndex((field) => field.fieldId === fieldId)
    if (index === -1 || index === fields.length - 1) {
      return []
    }
    return fields.slice(index + 1)
  }

  public toggleFieldVisibility(schema: SchemaIdMap): FormFieldsVO {
    return new FormFieldsVO(
      this.props.map((formField) => {
        const field = schema.get(formField.fieldId)
        return field ? formField.toggleVisibility(field) : formField
      }),
    )
  }

  public show(schema: SchemaIdMap): FormFieldsVO {
    return new FormFieldsVO(
      this.props.map((formField) => {
        const field = schema.get(formField.fieldId)
        return field ? formField.show(field) : formField
      }),
    )
  }

  public hide(schema: SchemaIdMap): FormFieldsVO {
    return new FormFieldsVO(
      this.props.map((formField) => {
        const field = schema.get(formField.fieldId)
        return field ? formField.hide(field) : formField
      }),
    )
  }

  public getVisibleFields(): FormFieldVO[] {
    return this.props.filter((formField) => !formField.hidden)
  }

  toJSON() {
    return this.props.map((field) => field.toJSON())
  }
}
