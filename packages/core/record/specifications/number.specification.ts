import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'
import { RecordValueSpecifcationBase } from './record-value-specification.base'

export class NumberEqual extends RecordValueSpecifcationBase<number> {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getNumberValue(this.name).mapOr(false, (value) => value === this.value)
  }

  accept(v: IRecordVisitor): Result<void, string> {
    v.numberEqual(this)
    return Ok(undefined)
  }
}
