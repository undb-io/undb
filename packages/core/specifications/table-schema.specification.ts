import { CompositeSpecification } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ITableSpecVisitor } from '.'
import type { Table } from '../table'
import type { ICreateTableSchemaInput } from '../value-objects'
import { TableSchema } from '../value-objects'

export class WithTableSchema extends CompositeSpecification<Table, ITableSpecVisitor> {
  constructor(public readonly schema: TableSchema) {
    super()
  }

  static from(input: ICreateTableSchemaInput): WithTableSchema {
    return new this(TableSchema.create(input))
  }

  isSatisfiedBy(t: Table): boolean {
    return t.schema.equals(this.schema)
  }

  mutate(t: Table): Result<Table, string> {
    t.schema = this.schema
    return Ok(t)
  }

  accept(v: ITableSpecVisitor): Result<void, string> {
    throw new Error('Method not implemented.')
  }
}
