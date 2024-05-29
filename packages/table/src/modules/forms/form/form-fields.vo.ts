import { None, Option, Some, ValueObject } from "@undb/domain"
import { FormFieldVO } from "./form-field.vo"
import type { TableDo } from "../../../table.do"
import type { Field } from "../.."

export class FormFieldsVO extends ValueObject<FormFieldVO[]> {
  static create(table: TableDo) {
    const fields = table.getOrderedMutableFields()
    return new FormFieldsVO(fields.map((field) => FormFieldVO.create(field)))
  }

  public addField(field: Field) {
    return new FormFieldsVO([...this.props, FormFieldVO.create(field)])
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

  toJSON() {
    return this.props.map((field) => field.toJSON())
  }
}
