/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { DateRangeField } from '@undb/core'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import {
  UnderlyingBoolColumn,
  UnderlyingColorColumn,
  UnderlyingCurrencyColumn,
  UnderlyingDateRangeFromColumn,
  UnderlyingDateRangeToColumn,
  UnderlyingEmailColumn,
  UnderlyingJsonColumn,
  UnderlyingNumberColumn,
  UnderlyingRatingColumn,
  UnderlyingSelectColumn,
  UnderlyingStringColumn,
  UnderlyingUrlColumn,
} from '../underlying-column.js'
import { CollaboratorForeignTable } from '../underlying-foreign-table.js'
import { BaseColumnTypeModifier } from './base.column-type-modifier.js'

export class DateRangeColumnTypeModifier extends BaseColumnTypeModifier<DateRangeField> {
  private fromColumn = new UnderlyingDateRangeFromColumn(this.field.id.value, this.tableId)
  private toColumn = new UnderlyingDateRangeToColumn(this.field.id.value, this.tableId)

  private dropDateRange() {
    this.dropColumn(this.fromColumn)
    this.dropColumn(this.toColumn)
  }

  private castFromDateRange(column: IUnderlyingColumn, alter?: () => string) {
    const query = this.knex.schema
      .alterTable(this.tableId, (tb) => {
        column.build(tb, this.knex, false)
      })
      .toQuery()
    this.addQueries(query)

    if (alter) {
      const alterQuery = alter()
      this.addQueries(alterQuery)
    }

    this.dropDateRange()
  }

  string(): void {
    const newColumn = new UnderlyingStringColumn(this.field.id.value, this.tableId)

    this.castFromDateRange(newColumn, () =>
      this.knex
        .queryBuilder()
        .table(this.tableId)
        .update(newColumn.name, this.knex.raw(`${this.fromColumn.name} || ' - ' || ${this.toColumn.name}`))
        .toQuery(),
    )
  }
  number(): void {
    const newColumn = new UnderlyingNumberColumn(this.field.id.value, this.tableId)
    this.castFromDateRange(newColumn, () =>
      this.knex
        .queryBuilder()
        .table(this.tableId)
        .update(newColumn.name, this.knex.raw(`cast(${this.fromColumn.name} as int)`))
        .toQuery(),
    )
  }
  color(): void {
    const newColumn = new UnderlyingColorColumn(this.field.id.value, this.tableId)
    this.castFromDateRange(newColumn)
  }
  email(): void {
    const newColumn = new UnderlyingEmailColumn(this.field.id.value, this.tableId)
    this.castFromDateRange(newColumn)
  }
  url(): void {
    const newColumn = new UnderlyingUrlColumn(this.field.id.value, this.tableId)
    this.castFromDateRange(newColumn)
  }
  json(): void {
    const newColumn = new UnderlyingJsonColumn(this.field.id.value, this.tableId)
    this.castFromDateRange(newColumn)
  }
  date(): void {
    const newColumn = new UnderlyingStringColumn(this.field.id.value, this.tableId)

    this.castFromDateRange(newColumn, () =>
      this.knex
        .queryBuilder()
        .table(this.tableId)
        .update(newColumn.name, this.knex.raw(this.fromColumn.name))
        .toQuery(),
    )
  }
  select(): void {
    const newColumn = new UnderlyingSelectColumn(this.field.id.value, this.tableId)
    this.castFromDateRange(newColumn)
  }
  bool(): void {
    const newColumn = new UnderlyingBoolColumn(this.field.id.value, this.tableId)
    this.castFromDateRange(newColumn)
  }
  reference(): void {
    this.dropDateRange()
  }
  tree(): void {
    throw new Error('Method not implemented.')
  }
  rating(): void {
    const newColumn = new UnderlyingRatingColumn(this.field.id.value, this.tableId)
    this.castFromDateRange(newColumn)
  }
  currency(): void {
    const newColumn = new UnderlyingCurrencyColumn(this.field.id.value, this.tableId)
    this.castFromDateRange(newColumn)
  }
  attachment(): void {
    this.dropDateRange()
  }
  qrcode(): void {
    this.dropDateRange()
  }
  count(): void {
    this.dropDateRange()
  }
  sum(): void {
    this.dropDateRange()
  }
  average(): void {
    this.dropDateRange()
  }
  lookup(): void {
    this.dropDateRange()
  }
  collaborator(): void {
    const collaboratorTable = new CollaboratorForeignTable(this.tableId, this.field.id.value)
    this.addQueries(...collaboratorTable.getCreateTableSqls(this.knex))

    this.dropDateRange()
  }
  min(): void {
    this.dropDateRange()
  }
  max(): void {
    this.dropDateRange()
  }
  ['multi-select'](): void {
    const newColumn = new UnderlyingSelectColumn(this.field.id.value, this.tableId)
    this.castFromDateRange(newColumn)
  }
  ['date-range'](): void {
    throw new Error('Method not implemented.')
  }
}
