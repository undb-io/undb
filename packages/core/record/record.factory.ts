import type { CompositeSpecification } from '@egodb/domain'
import { Record } from './record'
import type { IRecordVisitor } from './specifications'

export class RecordFactory {
  static create(spec: CompositeSpecification<Record, IRecordVisitor>) {
    return spec.mutate(Record.create())
  }
}
