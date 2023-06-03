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
import { isValid } from 'date-fns'
import { Mixin } from 'ts-mixer'
import { User } from '../../entity/user.js'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import { BaseEntityManager } from '../../repository/base-entity-manager.js'
import {
  UnderlyingDateColumn,
  UnderlyingDateRangeFromColumn,
  UnderlyingDateRangeToColumn,
} from '../underlying-column.js'
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

  protected dropColumn(column: IUnderlyingColumn) {
    if (!column.virtual) {
      const dropColumn = `ALTER TABLE ${this.tableId} DROP COLUMN ${column.name}`
      this.addQueries(dropColumn)
    }
  }

  protected alterColumn(
    newColumn: IUnderlyingColumn,
    column: IUnderlyingColumn,
    cast?: (newColumn: IUnderlyingColumn, column: IUnderlyingColumn) => string | null,
  ): void {
    const addColumn = this.knex.schema
      .alterTable(this.tableId, (tb) => {
        column.virtual ? newColumn.build(tb, this.knex, false) : newColumn.buildTemp(tb)
      })
      .toQuery()
    this.addQueries(addColumn)

    const query = cast?.(newColumn, column)
    if (query) this.addQueries(query)

    if (!column.virtual) {
      this.dropColumn(column)

      const alterName = this.knex.schema
        .alterTable(this.tableId, (tb) => {
          tb.renameColumn(newColumn.tempName, newColumn.name)
        })
        .toQuery()
      this.addQueries(alterName)
    }
  }

  protected castTo(type: SqliteCastType, newColumn: IUnderlyingColumn, column: IUnderlyingColumn) {
    if (column.virtual) throw new Error('cannot cast virtual underlying column')
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

  protected castToDate(column: IUnderlyingColumn) {
    this.addJobs(async () => {
      const newColumn = new UnderlyingDateColumn(this.field.id.value, this.tableId)

      const addColumn = this.knex.schema
        .alterTable(this.tableId, (tb) => {
          newColumn.buildTemp(tb)
        })
        .toQuery()

      await this.em.execute(addColumn)

      const qb = this.knex.queryBuilder().select(INTERNAL_COLUMN_ID_NAME, column.name).from(this.tableId)
      const value = (await this.em.execute(qb)) as { id: string; [key: string]: string }[]

      for (const row of value) {
        const dateString = row[column.name]
        if (!dateString) continue

        const date = new Date(dateString)
        if (!isValid(date)) continue

        const qb = this.knex
          .queryBuilder()
          .table(this.tableId)
          .update(newColumn.tempName, date.toISOString())
          .where(INTERNAL_COLUMN_ID_NAME, row.id)
        await this.em.execute(qb)
      }

      const dropColumn = `ALTER TABLE ${this.tableId} DROP COLUMN ${column.name}`
      await this.em.execute(dropColumn)

      const alterName = this.knex.schema
        .alterTable(this.tableId, (tb) => {
          tb.renameColumn(newColumn.tempName, newColumn.name)
        })
        .toQuery()
      await this.em.execute(alterName)
    })
  }

  protected castToCollaborator(column: IUnderlyingColumn, collaboratorField?: 'username' | 'email') {
    const { tableName: userTableName, properties } = this.em.getMetadata().get(User.name)
    const collaboratorTable = new CollaboratorForeignTable(this.tableId, this.field.id.value)
    this.addQueries(...collaboratorTable.getCreateTableSqls(this.knex))

    if (collaboratorField) {
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
    }

    this.dropColumn(column)
  }

  protected castToDateRange(column: IUnderlyingColumn, cast = false) {
    const newFrom = new UnderlyingDateRangeFromColumn(this.field.id.value, this.tableId)
    const newTo = new UnderlyingDateRangeToColumn(this.field.id.value, this.tableId)

    const newFromQuery = this.knex.schema
      .alterTable(this.tableId, (tb) => {
        newFrom.build(tb)
      })
      .toQuery()
    this.addQueries(newFromQuery)

    const newToQuery = this.knex.schema
      .alterTable(this.tableId, (tb) => {
        newTo.build(tb)
      })
      .toQuery()
    this.addQueries(newToQuery)

    if (cast) {
      const update = this.knex
        .queryBuilder()
        .table(this.tableId)
        .update(newFrom.name, this.knex.raw(column.name))
        .toQuery()
      this.addQueries(update)
    }

    this.dropColumn(column)
  }
}
