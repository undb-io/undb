import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import type { IFilterValue } from '../../filter'
import type { Record } from '../record'
import type { IRecordVisitor } from './interface'

export abstract class RecordValueSpecifcationBase<T extends IFilterValue = IFilterValue> extends CompositeSpecification<
  Record,
  IRecordVisitor
> {
  constructor(readonly name: string, readonly value: T) {
    super()
  }

  mutate(): Result<Record, string> {
    throw new Error('record value specification used only for query')
  }
}
