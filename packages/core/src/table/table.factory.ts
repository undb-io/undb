import { and } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ClsStore } from '../cls/cls.js'
import { WithTableForms } from './form/specifications/form.specification.js'
import { WithTableBaseId, WithTableEmoji, WithTableId, WithTableName, WithTableSchema } from './specifications/index.js'
import type { TableCompositeSpecification } from './specifications/interface.js'
import { newTableSpec } from './specifications/specifications.js'
import type { IQueryTable } from './table.js'
import { Table } from './table.js'
import type { ICreateTableInput_internal } from './table.schema.js'
import type { ICreateTableSchemaInput } from './value-objects/index.js'
import { WithTableViews, WithViewsOrder } from './view/index.js'

export class TableFactory {
  static create(...specs: TableCompositeSpecification[]): Result<Table, string>
  static create(spec: TableCompositeSpecification): Result<Table, string>
  static create(spec: TableCompositeSpecification | TableCompositeSpecification[]): Result<Table, string> {
    if (Array.isArray(spec)) {
      return and(...spec)
        .unwrap()
        .mutate(Table.empty())
    }

    const table = Table.empty()
    return spec.mutate(table).map(() => table)
  }

  static from(input: ICreateTableInput_internal, ctx: ClsStore) {
    const spec = newTableSpec(input, ctx)
    const table = this.create(spec).unwrap()

    const viewsOrder = WithViewsOrder.fromArray(table.views.ids.map((id) => id.value))
    viewsOrder.mutate(table)

    return Ok(table)
  }

  static unsafeCreate(input: ICreateTableInput_internal) {
    const spec = WithTableName.unsafe(input.name)
      .and(WithTableId.fromString(input.id))
      .and(WithTableSchema.unsafeFrom(input.schema))
      .and(WithTableViews.from(input.views))
      .and(WithViewsOrder.fromArray(input.viewsOrder ?? []))
      .and(WithTableBaseId.fromString(input.baseId))
      .and(WithTableForms.unsafeFrom(input.forms ?? []))
      .and(WithTableEmoji.fromString(input.emoji ?? null))

    return this.create(spec)
  }

  static fromQuery(q: IQueryTable): Table {
    const ts = WithTableSchema.unsafeFrom(q.schema as ICreateTableSchemaInput)
    const spec = WithTableName.fromString(q.name)
      .and(WithTableId.fromExistingString(q.id).unwrap())
      .and(ts)
      .and(WithTableViews.from(q.views))
      .and(WithViewsOrder.fromArray(q.viewsOrder ?? []))
      .and(WithTableBaseId.fromString(q.baseId))
      .and(WithTableForms.from(q.forms ?? [], ts.schema))
      .and(WithTableEmoji.fromString(q.emoji))

    return this.create(spec).unwrap()
  }
}
