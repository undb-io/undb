import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { BoolFieldValue } from '../../field/index.js'
import type { Record } from '../record.js'
import type { IRecordVisitor } from './interface.js'
import { BaseRecordSpecification } from './record-specification.base.js'

export class BoolIsTrue extends BaseRecordSpecification<BoolFieldValue> {
  constructor(name: string) {
    super(name, BoolFieldValue.T)
  }

  /**
   * check given bool is true
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    return value instanceof BoolFieldValue && value.equals(BoolFieldValue.T)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.boolIsTrue(this)
    return Ok(undefined)
  }
}

export class BoolIsFalse extends BaseRecordSpecification<BoolFieldValue> {
  constructor(name: string) {
    super(name, BoolFieldValue.F)
  }

  /**
   * check given bool is false
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    const value = r.values.value.get(this.fieldId)
    return value instanceof BoolFieldValue && value.equals(BoolFieldValue.F)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.boolIsFalse(this)
    return Ok(undefined)
  }
}
