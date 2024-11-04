import { z } from "@undb/zod"
import { toDate } from "date-fns"
import { FieldValueObject } from "../../field-value"

const date = z.union([z.date(), z.string().datetime(), z.string().date(), z.null(), z.undefined()])

const startDate = date
const endDate = date

export const dateRangeFieldValue = z.tuple([startDate, endDate]).optional().nullable()

export type IDateRangeFieldValue = z.infer<typeof dateRangeFieldValue>

export class DateRangeFieldValue extends FieldValueObject<IDateRangeFieldValue> {
  constructor(value: IDateRangeFieldValue) {
    super(value ? value : { value: null })
  }

  public get start() {
    const start = this.value?.[0]
    return start ? toDate(start) : null
  }

  public get end() {
    const end = this.value?.[1]
    return end ? toDate(end) : null
  }

  isEmpty() {
    return (this.start === null || this.start === undefined) && (this.end === null || this.end === undefined)
  }
}
