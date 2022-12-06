import { CompositeSpecification } from '@egodb/domain/dist'
import type { Result } from 'oxide.ts'
import type { Record } from '../record'
import type { IRecordValueVisitor } from './interface'

export abstract class RecordValueSpecifcationBase<T> extends CompositeSpecification<Record, IRecordValueVisitor> {
  constructor(readonly name: string, readonly value: T) {
    super()
  }

  mutate(): Result<Record, string> {
    throw new Error('Method [RecordSpecificationBase.mutate] not implemented.')
  }
}
