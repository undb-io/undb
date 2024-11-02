import { z } from "@undb/zod"
import { FieldValueObject } from "../../field-value"

const date = z.union([z.date(), z.string().datetime(), z.string().date(), z.null(), z.undefined()])

const startDate = date
const endDate = date

export const dateRangeFieldValue = z.tuple([startDate, endDate])

export type IDateRangeFieldValue = z.infer<typeof dateRangeFieldValue>

export class DateRangeFieldValue extends FieldValueObject<IDateRangeFieldValue> {
  constructor(value: IDateRangeFieldValue) {
    super(value)
  }

  isEmpty() {
    return (
      (this.value[0] === null || this.value[0] === undefined) && (this.value[1] === null || this.value[1] === undefined)
    )
  }
}
