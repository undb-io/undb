import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { SelectFieldValue } from '../../field/fields/select/select-field-value.js'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'
import { BaseRecordQuerySpecification, BaseRecordSpecification } from './record-specification.base.js'

export class SelectEqual extends BaseRecordSpecification<SelectFieldValue> {
  /**
   * check given select is equal to record value by field name
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    return value instanceof SelectFieldValue && this.value.equals(value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.selectEqual(this)
    return Ok(undefined)
  }
}

export class SelectIn extends BaseRecordQuerySpecification<SelectFieldValue[]> {
  /**
   * check given select is equal to record value by field name
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof SelectFieldValue)) return false
    const option = value.unpack()
    return !!option && this.value.map((v) => v.id).includes(option)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.selectIn(this)
    return Ok(undefined)
  }
}

export class SelectEmpty extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(public readonly fieldId: string) {
    super()
  }

  mutate(r: Record): Result<Record, string> {
    r.values.setValue(this.fieldId, new SelectFieldValue(null))
    return Ok(r)
  }
  /**
   * check given select is equal to record value by field name
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    if (!(value instanceof SelectFieldValue)) return false
    const option = value.unpack()
    return !option
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.selectEmpty(this)
    return Ok(undefined)
  }
}
