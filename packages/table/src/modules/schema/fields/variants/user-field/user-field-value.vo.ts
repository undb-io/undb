import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { isEmpty } from "radash"
import type { UserField } from "./user-field.vo"

const userId = z.string()

export const userFieldValue = z.union([userId, userId.array()]).nullable()

export type IUserFieldValue = z.infer<typeof userFieldValue>

export class UserFieldValue extends ValueObject<IUserFieldValue> {
  constructor(value: IUserFieldValue) {
    super(Array.isArray(value) ? value : { value })
  }

  isEmpty() {
    return this.value === null || this.value === undefined || isEmpty(this.value)
  }

  getValue(field: UserField): IUserFieldValue {
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
