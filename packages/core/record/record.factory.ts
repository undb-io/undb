import { and } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import type { TableSchemaMap } from '../value-objects'
import { Record } from './record'
import type { IQueryRecordSchema } from './record.type'
import { WithRecordCreatedAt, WithRecordId, WithRecordTableId, WithRecordValues } from './specifications'
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

  static fromQuery(r: IQueryRecordSchema, schema: TableSchemaMap): Result<Record, string> {
    return this.create(
      WithRecordId.fromString(r.id),
      WithRecordTableId.fromString(r.tableId).unwrap(),
      WithRecordCreatedAt.fromDate(r.createdAt),
      WithRecordValues.fromObject(schema, r.values),
    )
  }
}
