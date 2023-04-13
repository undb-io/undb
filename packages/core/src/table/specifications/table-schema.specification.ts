import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ClsStore } from '../../cls/cls.js'
import type { Table } from '../table.js'
import type { ICreateTableSchemaInput } from '../value-objects/index.js'
import { TableSchema } from '../value-objects/index.js'
import type { ITableSpecVisitor } from './interface.js'

export class WithTableSchema extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly schema: TableSchema) {
    super()
  }

  static from(input: ICreateTableSchemaInput, ctx: ClsStore): WithTableSchema {
    return new this(TableSchema.create(input, ctx))
  }

  static unsafeFrom(input: ICreateTableSchemaInput): WithTableSchema {
    return new this(TableSchema.unsafeCreate(input))
  }

  isSatisfiedBy(t: Table): boolean {
    return t.schema.equals(this.schema)
  }

  mutate(t: Table): Result<Table, string> {
    t.schema = this.schema
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    v.schemaEqual(this)
    return Ok(undefined)
  }
}
