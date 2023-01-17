import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { BoolFieldValue } from '../../field/bool-field-value'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'

abstract class BaseBoolSpecification extends CompositeSpecification<Record, IRecordVisitor> {
  constructor(readonly fieldId: string, readonly value: boolean) {
    super()
  }

  mutate(r: Record): Result<Record, string> {
    const boolValue = new BoolFieldValue(this.value)
    r.values.setValue(this.fieldId, boolValue)
    return Ok(r)
  }
}

export class BoolIsTrue extends BaseBoolSpecification {
  constructor(name: string) {
    super(name, true)
  }

  /**
   * check given bool is true
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    return r.values.getBoolValue(this.fieldId).mapOr(false, (value) => value === true)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.boolIsTrue(this)
    return Ok(undefined)
  }
}

export class BoolIsFalse extends BaseBoolSpecification {
  constructor(name: string) {
    super(name, false)
  }

  /**
   * check given bool is false
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    return r.values.getBoolValue(this.fieldId).mapOr(false, (value) => value === false)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.boolIsFalse(this)
    return Ok(undefined)
  }
}
