import { z } from "@undb/zod"
import { isEmpty } from "radash"
import { FieldValueObject } from "../../field-value"
import { userFieldMacroSchema } from "./user-field-macro"
import type { UserField } from "./user-field.vo"

const userId = z.string()

export const userFieldValue = z
  .union([userId.or(userFieldMacroSchema), userId.or(userFieldMacroSchema).array()])
  .nullable()
  .optional()

export const singleUserFieldValue = userId.or(userFieldMacroSchema).nullable()
export type ISingleUserFieldValue = z.infer<typeof singleUserFieldValue>

export const multipleUserFieldValue = userId.or(userFieldMacroSchema).array().nullable()
export type IMultipleUserFieldValue = z.infer<typeof multipleUserFieldValue>

export type IUserFieldValue = z.infer<typeof userFieldValue>

export let userFieldDisplayValue = z
  .object({
    username: z.string(),
    email: z.string().email(),
  })
  .nullable()

export type IUserFieldDisplayValue = z.infer<typeof userFieldDisplayValue>

export class UserFieldValue extends FieldValueObject<IUserFieldValue> {
  constructor(value: IUserFieldValue) {
    super(Array.isArray(value) ? value : { value: value ?? null })
  }

  isEmpty() {
    return this.value === null || this.value === undefined || isEmpty(this.value)
  }

  getValue(field: UserField): IUserFieldValue {
    if (field.isSingle) {
      return Array.isArray(this.props) ? this.props[0] || null : this.props?.value
    }

    return Array.isArray(this.props)
      ? this.props.length
        ? this.props
        : null
      : this.props?.value
        ? [this.props.value]
        : []
  }
}
