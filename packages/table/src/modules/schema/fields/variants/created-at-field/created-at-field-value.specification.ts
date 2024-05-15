import { Ok, type Result } from "@undb/domain"
import { endOfDay, isAfter, isBefore, startOfDay } from "date-fns"
import type { IRecordVisitor, RecordDO } from "../../../../records"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import type { FieldId } from "../../field-id.vo"
import { CreatedAtFieldValue } from "./created-at-field-value.vo"

export class CreatedAtIsSameDay extends RecordComositeSpecification {
  constructor(
    readonly date: Date,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(
      false,
      (v) =>
        v instanceof CreatedAtFieldValue &&
        isBefore(v.value, endOfDay(this.date)) &&
        isAfter(v.value, startOfDay(this.date)),
    )
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.createdAtIsSameDate(this)
    return Ok(undefined)
  }
}
