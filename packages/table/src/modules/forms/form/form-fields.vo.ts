import { ValueObject } from "@undb/domain"
import { FormFieldVO } from "./form-field.vo"
import type { TableDo } from "../../../table.do"

export class FormFieldsVO extends ValueObject<FormFieldVO[]> {
  static create(table: TableDo) {
    const fields = table.getOrderedMutableFields()
    return new FormFieldsVO(fields.map((field) => FormFieldVO.create(field)))
  }

  toJSON() {
    return this.props.map((field) => field.toJSON())
  }
}
