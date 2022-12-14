import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IFieldValue } from '../../field'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'

export abstract class RecordValueSpecifcationBase<T extends IFieldValue = IFieldValue> extends CompositeSpecification<
  Record,
  IRecordVisitor
> {
  constructor(readonly name: string, readonly value: T) {
    super()
  }

  mutate(r: Record): Result<Record, string> {
    r.values.set(this.name, this.value)
    return Ok(r)
  }
}
