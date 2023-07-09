/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { INTERNAL_COLUMN_ID_NAME, type MinField } from '@undb/core'
import { ReferenceField } from '../../entity/field.js'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import { UnderlyingForeignTableFactory } from '../undelying-foreign-table.factory.js'
import {
  UnderlyingBoolColumn,
  UnderlyingColorColumn,
  UnderlyingMinColumn,
  UnderlyingCurrencyColumn,
  UnderlyingDateColumn,
  UnderlyingEmailColumn,
  UnderlyingJsonColumn,
  UnderlyingNumberColumn,
  UnderlyingRatingColumn,
  UnderlyingSelectColumn,
  UnderlyingStringColumn,
  UnderlyingUrlColumn,
} from '../underlying-column.js'
import { BaseColumnTypeModifier } from './base.column-type-modifier.js'

export class MinColumnTypeModifier extends BaseColumnTypeModifier<MinField> {
  private readonly column = new UnderlyingMinColumn(this.field.id.value, this.tableId)

  private castCountColumn(column: IUnderlyingColumn) {
    this.addQueries(this.knex.schema.alterTable(this.tableId, (tb) => column.build(tb, this.knex, false)).toQuery())
    this.addJobs(async () => {
      const referenceFieldId = this.field.referenceFieldId
      const referenceField = await this.em.findOne(ReferenceField, referenceFieldId.value)
      if (!referenceField) return

      const field = referenceField.toDomain()

      const ft = UnderlyingForeignTableFactory.create(this.tableId, field)

      const subQuery = this.knex
        .queryBuilder()
        .select(`${ft.fromId} as id`, this.knex.raw(`min(*) as value`))
        .from(ft.name)
        .groupBy(ft.fromId)
        .toQuery()

      const query = `
      UPDATE ${this.tableId}
      SET ${column.name} = tt.value
      FROM (${subQuery}) as tt
      WHERE tt.id = ${this.tableId}.${INTERNAL_COLUMN_ID_NAME}
      `

      await this.em.execute(query)
    })
  }

  string(): void {
    const newColumn = new UnderlyingStringColumn(this.field.id.value, this.tableId)
    this.castCountColumn(newColumn)
  }
  number(): void {
    const newColumn = new UnderlyingNumberColumn(this.field.id.value, this.tableId)
    this.castCountColumn(newColumn)
  }
  color(): void {
    const newColumn = new UnderlyingColorColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  email(): void {
    const newColumn = new UnderlyingEmailColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  url(): void {
    const newColumn = new UnderlyingUrlColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  json(): void {
    const newColumn = new UnderlyingJsonColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  date(): void {
    const newColumn = new UnderlyingDateColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  select(): void {
    const newColumn = new UnderlyingSelectColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  bool(): void {
    const newColumn = new UnderlyingBoolColumn(this.field.id.value, this.tableId)
    this.castCountColumn(newColumn)
  }
  reference(): void {
    this.dropColumn(this.column)
  }
  tree(): void {
    throw new Error('Method not implemented.')
  }
  rating(): void {
    const newColumn = new UnderlyingRatingColumn(this.field.id.value, this.tableId)
    this.castCountColumn(newColumn)
  }
  currency(): void {
    const newColumn = new UnderlyingCurrencyColumn(this.field.id.value, this.tableId)
    this.castCountColumn(newColumn)
  }
  attachment(): void {
    this.dropColumn(this.column)
  }
  collaborator(): void {
    this.castToCollaborator(this.column)
  }
  count(): void {
    this.dropColumn(this.column)
  }
  sum(): void {
    this.dropColumn(this.column)
  }
  average(): void {
    this.dropColumn(this.column)
  }
  lookup(): void {
    this.dropColumn(this.column)
  }
  min(): void {
    throw new Error('Method not implemented.')
  }
  ['multi-select'](): void {
    const newColumn = new UnderlyingSelectColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  ['date-range'](): void {
    this.castToDateRange(this.column)
  }
}
