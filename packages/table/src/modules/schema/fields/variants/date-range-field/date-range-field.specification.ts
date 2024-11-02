import { Ok, type Result } from "@undb/domain"
import type { IRecordVisitor } from "../../../../records/record/record-visitor.interface"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import type { RecordDO } from "../../../../records/record/record.do"
import type { FieldId } from "../../field-id.vo"
import { DateRangeFieldValue } from "./date-range-field-value.vo"

export class DateRangeEqual extends RecordComositeSpecification {
  constructor(
    readonly dateRange: DateRangeFieldValue,
    readonly fieldId: FieldId,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(
      false,
      (v) => v.value instanceof DateRangeFieldValue && this.dateRange !== null && v.value.equals(this.dateRange),
    )
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, this.dateRange)
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeEqual(this)
    return Ok(undefined)
  }
}

export class DateRangeIsEmpty extends RecordComositeSpecification {
  constructor(readonly fieldId: FieldId) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v.value instanceof DateRangeFieldValue && v.value.isEmpty())
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new DateRangeFieldValue([null, null]))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeIsEmpty(this)
    return Ok(undefined)
  }
}
