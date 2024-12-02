import { Ok, type Result } from "@undb/domain"
import { endOfDay, isAfter, isBefore, isToday, isTomorrow, isYesterday, startOfDay } from "date-fns"
import type { IRecordVisitor } from "../../../../records/record/record-visitor.interface"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import type { RecordDO } from "../../../../records/record/record.do"
import type { FieldId } from "../../field-id.vo"
import { DateFieldValue } from "../date-field/date-field-value.vo"
import { DateRangeFieldValue } from "./date-range-field-value.vo"
import type { IDateRangeFieldConditionItemScope } from "./date-range-field.condition"

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

export class DateRangeDateIsSameDay extends RecordComositeSpecification {
  constructor(
    readonly date: Date,
    readonly fieldId: FieldId,
    readonly scope: IDateRangeFieldConditionItemScope,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(
      false,
      (v) =>
        v.value instanceof Date && isBefore(v.value, endOfDay(this.date)) && isAfter(v.value, startOfDay(this.date)),
    )
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeDateIsSameDay(this)
    return Ok(undefined)
  }
}

export class DateRangeDateIsToday extends RecordComositeSpecification {
  constructor(
    readonly fieldId: FieldId,
    readonly scope: IDateRangeFieldConditionItemScope,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v.value instanceof Date && isToday(v.value))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeDateIsToday(this)
    return Ok(undefined)
  }
}

export class DateRangeDateIsTomorrow extends RecordComositeSpecification {
  constructor(
    readonly fieldId: FieldId,
    readonly scope: IDateRangeFieldConditionItemScope,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v.value instanceof Date && isTomorrow(v.value))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeDateIsTomorrow(this)
    return Ok(undefined)
  }
}

export class DateRangeDateIsYesterday extends RecordComositeSpecification {
  constructor(
    readonly fieldId: FieldId,
    readonly scope: IDateRangeFieldConditionItemScope,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v.value instanceof Date && isYesterday(v.value))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeDateIsYesterday(this)
    return Ok(undefined)
  }
}

export class DateRangeDateIsBefore extends RecordComositeSpecification {
  constructor(
    readonly date: Date,
    readonly fieldId: FieldId,
    readonly scope: IDateRangeFieldConditionItemScope,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v.value instanceof Date && isBefore(v.value, startOfDay(this.date)))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeDateIsBefore(this)
    return Ok(undefined)
  }
}

export class DateRangeDateIsAfter extends RecordComositeSpecification {
  constructor(
    readonly date: Date,
    readonly fieldId: FieldId,
    readonly scope: IDateRangeFieldConditionItemScope,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v.value instanceof Date && isAfter(v.value, endOfDay(this.date)))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeDateIsAfter(this)
    return Ok(undefined)
  }
}

export class DateRangeDateIsEmpty extends RecordComositeSpecification {
  constructor(
    readonly fieldId: FieldId,
    readonly scope: IDateRangeFieldConditionItemScope,
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new DateFieldValue(null))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.dateRangeDateIsEmpty(this)
    return Ok(undefined)
  }
}
