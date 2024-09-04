import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

export const percentageFieldValue = z.number().nonnegative().nullable()
export type IPercentageFieldValue = z.infer<typeof percentageFieldValue>

export class PercentageFieldValue extends FieldValueObject<IPercentageFieldValue> {
  constructor(value: IPercentageFieldValue) {
    super({ value: value ?? null })
  }

  isEmpty() {
    return this.props?.value === null || this.props?.value === undefined
  }
}
