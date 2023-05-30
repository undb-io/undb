/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { StringField } from '@undb/core'
import { UnderlyingNumberColumn, UnderlyingRatingColumn, UnderlyingStringColumn } from '../underlying-column.js'
import { BaseColumnTypeModifier } from './base.column-type-modifier.js'

export class StringColumnTypeModifier extends BaseColumnTypeModifier<StringField> {
  private readonly column = new UnderlyingStringColumn(this.field.id.value, this.tableId)
  string(): void {
    throw new Error('Method not implemented.')
  }
  number(): void {
    const newColumn = new UnderlyingNumberColumn(this.field.id.value, this.tableId)

    const addColumn = this.knex.schema
      .alterTable(this.tableId, (tb) => {
        newColumn.buildTemp(tb)
      })
      .toQuery()

    const query = this.knex
      .queryBuilder()
      .table(this.tableId)
      .update(newColumn.tempName, this.knex.raw(`cast(${this.column.name} as real)`))
      .toQuery()

    const dropColum = `ALTER TABLE ${this.tableId} DROP COLUMN ${this.column.name}`

    const alterName = this.knex.schema
      .alterTable(this.tableId, (tb) => {
        tb.renameColumn(newColumn.tempName, newColumn.name)
      })
      .toQuery()

    this.addQueries(addColumn, query, dropColum, alterName)
  }
  color(): void {}
  email(): void {}
  date(): void {
    throw new Error('Method not implemented.')
  }
  select(): void {
    throw new Error('Method not implemented.')
  }
  bool(): void {
    throw new Error('Method not implemented.')
  }
  reference(): void {
    throw new Error('Method not implemented.')
  }
  tree(): void {
    throw new Error('Method not implemented.')
  }
  parent(): void {
    throw new Error('Method not implemented.')
  }
  rating(): void {
    const newColumn = new UnderlyingRatingColumn(this.field.id.value, this.tableId)

    const addColumn = this.knex.schema
      .alterTable(this.tableId, (tb) => {
        newColumn.buildTemp(tb)
      })
      .toQuery()

    const query = this.knex
      .queryBuilder()
      .table(this.tableId)
      .update(newColumn.tempName, this.knex.raw(`cast(${this.column.name} as int)`))
      .toQuery()

    const dropColum = `ALTER TABLE ${this.tableId} DROP COLUMN ${this.column.name}`

    const alterName = this.knex.schema
      .alterTable(this.tableId, (tb) => {
        tb.renameColumn(newColumn.tempName, newColumn.name)
      })
      .toQuery()

    this.addQueries(addColumn, query, dropColum, alterName)
  }
  currency(): void {
    throw new Error('Method not implemented.')
  }
  count(): void {
    throw new Error('Method not implemented.')
  }
  lookup(): void {
    throw new Error('Method not implemented.')
  }
  sum(): void {
    throw new Error('Method not implemented.')
  }
  average(): void {
    throw new Error('Method not implemented.')
  }
  attachment(): void {
    throw new Error('Method not implemented.')
  }
  collaborator(): void {
    throw new Error('Method not implemented.')
  }
  ['multi-select'](): void {
    throw new Error('Method not implemented.')
  }
  ['date-range'](): void {
    throw new Error('Method not implemented.')
  }
}
