import { and } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Record } from './record'
import type { RecordCompositeSpecification } from './specifications/interface'

export class RecordFactory {
  static create(...specs: RecordCompositeSpecification[]): Result<Record, string>
  static create(spec: RecordCompositeSpecification): Result<Record, string>

  static create(spec: RecordCompositeSpecification | RecordCompositeSpecification[]): Result<Record, string> {
    if (Array.isArray(spec)) {
      return and(...spec)
        .unwrap()
        .mutate(Record.create())
    }
    return spec.mutate(Record.create())
  }
}
