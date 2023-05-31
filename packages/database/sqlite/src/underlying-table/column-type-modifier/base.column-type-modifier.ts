/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { AbstractFieldTypeHandler, type Field, type IFieldType, type IFieldTypeHandler } from '@undb/core'
import { Mixin } from 'ts-mixer'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import { BaseEntityManager } from '../../repository/base-entity-manager.js'

export type SqliteCastType = 'text' | 'int' | 'real' | 'bool'

export abstract class BaseColumnTypeModifier<F extends Field>
  extends Mixin(AbstractFieldTypeHandler, BaseEntityManager)
  implements IFieldTypeHandler
{
  constructor(
    protected readonly field: F,
    protected readonly tableId: string,
    protected readonly newType: IFieldType,
    em: EntityManager,
    protected readonly knex: Knex,
  ) {
    super(em)
  }

  protected alterColumn(
    newColumn: IUnderlyingColumn,
    column: IUnderlyingColumn,
    cast?: (newColumn: IUnderlyingColumn, column: IUnderlyingColumn) => string | null,
  ): string[] {
    const addColumn = this.knex.schema
      .alterTable(this.tableId, (tb) => {
        newColumn.buildTemp(tb)
      })
      .toQuery()

    const query = cast?.(newColumn, column)

    const dropColumn = `ALTER TABLE ${this.tableId} DROP COLUMN ${column.name}`

    const alterName = this.knex.schema
      .alterTable(this.tableId, (tb) => {
        tb.renameColumn(newColumn.tempName, newColumn.name)
      })
      .toQuery()

    return [addColumn, query ?? '', dropColumn, alterName].filter(Boolean)
  }

  protected castTo(type: SqliteCastType, newColumn: IUnderlyingColumn, column: IUnderlyingColumn) {
    return this.alterColumn(newColumn, column, () =>
      this.knex
        .queryBuilder()
        .table(this.tableId)
        .update(
          newColumn.tempName,
          type === 'bool' ? this.knex.raw(column.name) : this.knex.raw(`cast(${column.name} as ${type})`),
        )
        .toQuery(),
    )
  }

  id(): void {
    throw new Error('Method not implemented.')
  }
  ['created-at'](): void {
    throw new Error('Method not implemented.')
  }
  ['created-by'](): void {
    throw new Error('Method not implemented.')
  }
  ['updated-at'](): void {
    throw new Error('Method not implemented.')
  }
  ['updated-by'](): void {
    throw new Error('Method not implemented.')
  }
  ['auto-increment'](): void {
    throw new Error('Method not implemented.')
  }
  parent(): void {
    throw new Error('Method not implemented.')
  }
  count(): void {}
  average(): void {}
  sum(): void {}
  lookup(): void {}
}
