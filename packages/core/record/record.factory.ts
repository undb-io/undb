import { and } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import type { TableSchemaIdMap } from '../value-objects'
import { Record } from './record'
import type { IQueryRecordSchema, Records } from './record.type'
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

  static fromQueryRecords(rs: IQueryRecordSchema[], schema: TableSchemaIdMap): Records {
    return rs.map((r) => this.fromQuery(r, schema).unwrap())
  }

  static fromQuery(r: IQueryRecordSchema, schema: TableSchemaIdMap): Result<Record, string> {
    return this.create(
      WithRecordId.fromString(r.id)
        .and(WithRecordTableId.fromString(r.tableId).unwrap())
        .and(WithRecordCreatedAt.fromDate(r.createdAt))
        .and(WithRecordValues.fromObject(schema, r.values)),
    )
  }
}
