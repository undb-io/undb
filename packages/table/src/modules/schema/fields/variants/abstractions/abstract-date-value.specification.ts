import { Ok, type Result } from "@undb/domain"
import { endOfDay, isAfter, isBefore, isEqual, isTomorrow, isYesterday, startOfDay } from "date-fns"
import { isToday } from "date-fns/isToday"
import type { IRecordVisitor, RecordDO } from "../../../../records"
import { RecordComositeSpecification } from "../../../../records/record/record.composite-specification"
import type { FieldId } from "../../field-id.vo"
import { DateFieldValue } from "../date-field/date-field-value.vo"

export class DateIsSameDay extends RecordComositeSpecification {
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
        v.value instanceof Date && isBefore(v.value, endOfDay(this.date)) && isAfter(v.value, startOfDay(this.date)),
    )
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.dateIsSameDate(this)
    return Ok(undefined)
  }
}

export class DateIsToday extends RecordComositeSpecification {
  constructor(readonly fieldId: FieldId) {
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
    v.dateIsToday(this)
    return Ok(undefined)
  }
}

export class DateIsTomorrow extends RecordComositeSpecification {
  constructor(readonly fieldId: FieldId) {
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
    v.dateIsTomorrow(this)
    return Ok(undefined)
  }
}

export class DateIsYesterday extends RecordComositeSpecification {
  constructor(readonly fieldId: FieldId) {
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
    v.dateIsYesterday(this)
    return Ok(undefined)
  }
}

export class DateIsBefore extends RecordComositeSpecification {
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
        (v.value instanceof Date && isBefore(v.value, startOfDay(this.date))) ||
        isEqual(v.value, startOfDay(this.date)),
    )
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.dateIsBefore(this)
    return Ok(undefined)
  }
}

export class DateIsAfter extends RecordComositeSpecification {
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
        v.value instanceof Date && (isAfter(v.value, endOfDay(this.date)) || isEqual(v.value, endOfDay(this.date))),
    )
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error("Method not implemented.")
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.dateIsAfter(this)
    return Ok(undefined)
  }
}

export class DateIsEmpty extends RecordComositeSpecification {
  isSatisfiedBy(t: RecordDO): boolean {
    throw new Error("Method not implemented.")
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    t.values.setValue(this.fieldId, new DateFieldValue(null))
    return Ok(t)
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.dateIsEmpty(this)
    return Ok(undefined)
  }
}
