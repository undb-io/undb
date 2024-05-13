import { Ok, type Result } from '@undb/domain'
import type { IRecordVisitor, RecordDO } from '../../../../records'
import { RecordComositeSpecification } from '../../../../records/record/record.composite-specification'
import type { FieldId } from '../../field-id.vo'
import { StringFieldValue } from './string-field-value.vo'

export class StringEqual extends RecordComositeSpecification {
  constructor(
    readonly values: StringFieldValue,
    readonly fieldId: FieldId
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v instanceof StringFieldValue && v.equals(this.values))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.stringEqual(this)
    return Ok(undefined)
  }
}

export class StringContains extends RecordComositeSpecification {
  constructor(
    readonly value: string,
    readonly fieldId: FieldId
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v instanceof StringFieldValue && v.value.includes(this.value))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.stringContains(this)
    return Ok(undefined)
  }
}

export class StringStartsWith extends RecordComositeSpecification {
  constructor(
    readonly value: string,
    readonly fieldId: FieldId
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v instanceof StringFieldValue && v.value.startsWith(this.value))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.stringStartsWith(this)
    return Ok(undefined)
  }
}

export class StringEndsWith extends RecordComositeSpecification {
  constructor(
    readonly value: string,
    readonly fieldId: FieldId
  ) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v instanceof StringFieldValue && v.value.endsWith(this.value))
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.stringEndsWith(this)
    return Ok(undefined)
  }
}

export class StringEmpty extends RecordComositeSpecification {
  constructor(readonly fieldId: FieldId) {
    super(fieldId)
  }
  isSatisfiedBy(t: RecordDO): boolean {
    const value = t.getValue(this.fieldId)
    return value.mapOr(false, (v) => v instanceof StringFieldValue && !v.value)
  }
  mutate(t: RecordDO): Result<RecordDO, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IRecordVisitor): Result<void, string> {
    v.stringEmpty(this)
    return Ok(undefined)
  }
}
