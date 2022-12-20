import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'
import { RecordValueSpecifcationBase } from './record-value-specification.base'

// TODO: generic should be option
export class SelectEqual extends RecordValueSpecifcationBase<string> {
  /**
   * check given select is equal to record value by field name
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    return r.values.getSelectValue(this.name).mapOr(false, (value) => value.option === this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.selectEqual(this)
    return Ok(undefined)
  }
}

export class SelectIn extends RecordValueSpecifcationBase<string[]> {
  /**
   * check given select is equal to record value by field name
   * @param r - record
   * @returns bool
   */
  isSatisfiedBy(r: Record): boolean {
    return r.values
      .getSelectValue(this.name)
      .mapOr(false, (value) => !!value.option && this.value.includes(value.option))
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.selectIn(this)
    return Ok(undefined)
  }
}
