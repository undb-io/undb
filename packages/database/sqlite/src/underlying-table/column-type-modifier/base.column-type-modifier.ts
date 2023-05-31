/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import {
  AbstractFieldTypeHandler,
  INTERNAL_COLUMN_ID_NAME,
  type Field,
  type IFieldType,
  type IFieldTypeHandler,
} from '@undb/core'
import { Mixin } from 'ts-mixer'
import { User } from '../../entity/user.js'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import { BaseEntityManager } from '../../repository/base-entity-manager.js'
import { CollaboratorForeignTable } from '../underlying-foreign-table.js'

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
  ): void {
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

    const queries = [addColumn, query ?? '', dropColumn, alterName].filter(Boolean)
    this.addQueries(...queries)
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

  protected castToCollaborator(column: IUnderlyingColumn, collaboratorField: 'username' | 'email' = 'username') {
    const { tableName: userTableName, properties } = this.em.getMetadata().get(User.name)
    const collaboratorTable = new CollaboratorForeignTable(this.tableId, this.field.id.value)
    this.addQueries(...collaboratorTable.getCreateTableSqls(this.knex))

    const { id } = properties

    const subQuery = this.knex
      .queryBuilder()
      .select([
        { [CollaboratorForeignTable.RECORD_ID]: `${this.tableId}.${INTERNAL_COLUMN_ID_NAME}` },
        { [CollaboratorForeignTable.USER_ID]: `${userTableName}.${id.fieldNames[0]}` },
      ])
      .from(this.tableId)
      .whereNotNull(column.name)
      .innerJoin(
        userTableName,
        `${this.tableId}.${column.name}`,
        `${userTableName}.${properties[collaboratorField].fieldNames[0]}`,
      )

    const query = this.knex
      .queryBuilder()
      .insert(subQuery)
      .into(
        this.knex.raw('?? (??, ??)', [
          collaboratorTable.name,
          CollaboratorForeignTable.RECORD_ID,
          CollaboratorForeignTable.USER_ID,
        ]),
      )
      .toQuery()
    this.addQueries(query)

    const dropColumn = `ALTER TABLE ${this.tableId} DROP COLUMN ${column.name}`
    this.addQueries(dropColumn)
  }
}
