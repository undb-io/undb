import { and } from '@undb/domain'
import type { Result } from 'oxide.ts'
import type { Table } from '../table.js'
import type { TableSchemaIdMap } from '../value-objects/index.js'
import { Record } from './record.js'
import type { IQueryRecordSchema, IQueryRecordValues, Records } from './record.type.js'
import {
  WithDisplayValues,
  WithRecordCreatedAt,
  WithRecordCreatedBy,
  WithRecordCreatedByProfile,
  WithRecordId,
  WithRecordTableId,
  WithRecordUpdatedAt,
  WithRecordValues,
} from './specifications/index.js'
import type { RecordCompositeSpecification } from './specifications/interface.js'
import { WithRecordAutoIncrement } from './specifications/record-auto-increment.specification.js'
import { WithRecordUpdatedBy, WithRecordUpdatedByProfile } from './specifications/record-updated-by.specification.js'

export class RecordFactory {
  static create(...specs: RecordCompositeSpecification[]): Result<Record, string>
  static create(spec: RecordCompositeSpecification): Result<Record, string>

  static create(spec: RecordCompositeSpecification | RecordCompositeSpecification[]): Result<Record, string> {
    if (Array.isArray(spec)) {
      return and(...spec)
        .unwrap()
        .mutate(Record.empty())
    }
    return spec.mutate(Record.empty())
  }

  static temp(table: Table, values: IQueryRecordValues, userId: string): Record {
    const schema = table.schema.toIdMap()
    return this.create(
      WithRecordId.fromNullableString(),
      WithRecordCreatedAt.now(),
      WithRecordUpdatedAt.now(),
      WithRecordCreatedBy.fromString(userId),
      WithRecordUpdatedBy.fromString(userId),
      WithRecordValues.fromObject(schema, values),
    ).unwrap()
  }

  static fromQueryRecords(rs: IQueryRecordSchema[], schema: TableSchemaIdMap): Records {
    return rs.map((r) => this.fromQuery(r, schema).unwrap())
  }

  static fromQuery(r: IQueryRecordSchema, schema: TableSchemaIdMap): Result<Record, string> {
    let spec = WithRecordId.fromString(r.id)
      .and(WithRecordTableId.fromString(r.tableId).unwrap())
      .and(WithRecordCreatedAt.fromString(r.createdAt))
      .and(WithRecordCreatedBy.fromString(r.createdBy))
      .and(new WithRecordCreatedByProfile(r.createdByProfile))
      .and(WithRecordUpdatedAt.fromString(r.updatedAt))
      .and(WithRecordUpdatedBy.fromString(r.updatedBy))
      .and(new WithRecordUpdatedByProfile(r.updatedByProfile))
      .and(WithRecordValues.fromObject(schema, r.values))
      .and(WithDisplayValues.from(r.displayValues))

    if (typeof r.autoIncrement === 'number') {
      spec = spec.and(new WithRecordAutoIncrement(r.autoIncrement))
    }

    return this.create(spec)
  }
}
