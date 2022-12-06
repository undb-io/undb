import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { Record } from '../record'
import type { IRecordValueVisitor } from './interface'
import { RecordValueSpecifcationBase } from './record-value-specification.base'

export class NumberEqual extends RecordValueSpecifcationBase<number> {
  isSatisfiedBy(r: Record): boolean {
    return r.values.getNumberValue(this.name).mapOr(false, (value) => value === this.value)
  }

  accept(v: IRecordValueVisitor): Result<void, string> {
    v.numberEqual(this)
    return Ok(undefined)
  }
}
