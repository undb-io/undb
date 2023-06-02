/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { type CountField } from '@undb/core'
import { ReferenceField } from '../../entity/field.js'
import {
  UnderlyingBoolColumn,
  UnderlyingColorColumn,
  UnderlyingCountColumn,
  UnderlyingCurrencyColumn,
  UnderlyingDateColumn,
  UnderlyingEmailColumn,
  UnderlyingNumberColumn,
  UnderlyingSelectColumn,
  UnderlyingStringColumn,
} from '../underlying-column.js'
import { AdjacencyListTable } from '../underlying-foreign-table.js'
import { BaseColumnTypeModifier } from './base.column-type-modifier.js'

export class CountColumnTypeModifier extends BaseColumnTypeModifier<CountField> {
  private readonly column = new UnderlyingCountColumn(this.field.id.value, this.tableId)

  string(): void {
    const newColumn = new UnderlyingStringColumn(this.field.id.value, this.tableId)
    this.castTo('text', newColumn, this.column)
  }
  number(): void {
    const newColumn = new UnderlyingNumberColumn(this.field.id.value, this.tableId)

    this.addJobs(async () => {
      const referenceFieldId = this.field.referenceFieldId
      const referenceField = await this.em.findOne(ReferenceField, referenceFieldId.value)
      if (!referenceField) return

      // TODO: generic field type
      if (referenceField.type === 'reference') {
        const field = referenceField.toDomain()

        const ft = new AdjacencyListTable(this.tableId, field)

        const addColumn = this.knex.schema.alterTable(this.tableId, (tb) => newColumn.build(tb)).toQuery()
        await this.em.execute(addColumn)

        const subQuery = this.knex
          .queryBuilder()
          .select(this.knex.raw(`count(*) as value`))
          .from(ft.name)
          .groupBy(`${ft.name}.${AdjacencyListTable.FROM_ID}`)
          .toQuery()

        const query = `
      UPDATE ${this.tableId}
      SET ${newColumn.name} = tt.value
      FROM (${subQuery}) as tt
      `

        await this.em.execute(query)
      }
    })
  }
  color(): void {
    const newColumn = new UnderlyingColorColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  email(): void {
    const newColumn = new UnderlyingEmailColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  date(): void {
    this.alterColumn(new UnderlyingDateColumn(this.field.id.value, this.tableId), this.column)
  }
  select(): void {
    const newColumn = new UnderlyingSelectColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  bool(): void {
    const newColumn = new UnderlyingBoolColumn(this.field.id.value, this.tableId)
    this.castTo('bool', newColumn, this.column)
  }
  reference(): void {
    throw new Error('Method not implemented.')
  }
  tree(): void {
    throw new Error('Method not implemented.')
  }
  rating(): void {
    throw new Error('Method not implemented.')
  }
  currency(): void {
    const newColumn = new UnderlyingCurrencyColumn(this.field.id.value, this.tableId)
    this.castTo('real', newColumn, this.column)
  }
  attachment(): void {
    throw new Error('Method not implemented.')
  }
  collaborator(): void {
    this.dropColumn(this.column)
  }
  count(): void {
    throw new Error('Method not implemented.')
  }
  ['multi-select'](): void {
    const newColumn = new UnderlyingSelectColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  ['date-range'](): void {
    throw new Error('Method not implemented.')
  }
}
