import { contains } from '@fxts/core'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record'
import type { IRecordValueVisitor } from './interface'
import { RecordValueSpecifcationBase } from './record-value-specification.base'

export class StringEqual extends RecordValueSpecifcationBase<string> {
  /**
   * check given string is equal to record value
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    return r.values.getStringValue(this.name).mapOr(false, (value) => value === this.value)
  }

  accept(v: IRecordValueVisitor): Result<void, string> {
    v.stringEqual(this)
    return Ok(undefined)
  }
}

export class StringContain extends RecordValueSpecifcationBase<string> {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getStringValue(this.name).mapOr(false, contains(this.value))
  }

  accept(v: IRecordValueVisitor): Result<void, string> {
    v.stringContain(this)
    return Ok(undefined)
  }
}
