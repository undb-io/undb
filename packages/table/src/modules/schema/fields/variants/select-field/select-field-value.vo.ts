import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"
import { optionId, type IOptionId } from "../../option/option-id.vo"
import type { SelectField } from "./select-field.vo"

export const selectFieldValue = optionId.nullable().or(z.array(optionId)).nullable()
export type ISelectFieldValue = z.infer<typeof selectFieldValue>

export const mutateSelectFieldValueSchema = selectFieldValue
export type IMutateSelectFieldValueSchema = z.infer<typeof mutateSelectFieldValueSchema>

export class SelectFieldValue extends FieldValueObject<ISelectFieldValue> {
  constructor(option: ISelectFieldValue) {
    super(Array.isArray(option) ? option : { value: option })
  }

  isEmpty() {
    if (Array.isArray(this.props)) {
      return this.props.length === 0
    }

    return this.props.value === null || this.props.value === undefined
  }

  public getValue(field: SelectField): IOptionId | IOptionId[] | null {
    if (field.isSingle) {
      return Array.isArray(this.props) ? this.props[0] || null : this.props.value
    }

    return Array.isArray(this.props)
      ? this.props.length
        ? this.props
        : null
      : this.props.value
        ? [this.props.value]
        : []
  }
}
