import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"
import { optionId, type IOptionId } from "../../option/option-id.vo"
import type { SelectField } from "./select-field.vo"

export const selectFieldValue = optionId.nullable().or(z.array(optionId)).nullable()
export type ISelectFieldValue = z.infer<typeof selectFieldValue>

export class SelectFieldValue extends FieldValueObject<ISelectFieldValue> {
  constructor(option: ISelectFieldValue) {
    super(Array.isArray(option) ? option : { value: option })
  }

  static parseValue(value: string | string[] | null, field: SelectField): IOptionId | IOptionId[] | null {
    if (value === null || value === undefined) {
      return null
    }
    if (Array.isArray(value)) {
      return value
        .map((v) => field.options.find((op) => op.id === v || op.name === v))
        .filter((v) => !!v)
        .map((v) => v.id)
    }
    return field.options.find((op) => op.id === value || op.name === value)?.id ?? null
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
