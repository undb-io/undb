/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { SelectField } from '@undb/core'
import { Option } from '../../entity/option.js'
import {
  UnderlyingBoolColumn,
  UnderlyingColorColumn,
  UnderlyingDateColumn,
  UnderlyingEmailColumn,
  UnderlyingJsonColumn,
  UnderlyingMultiSelectColumn,
  UnderlyingNumberColumn,
  UnderlyingRatingColumn,
  UnderlyingSelectColumn,
  UnderlyingUrlColumn,
} from '../underlying-column.js'
import { BaseColumnTypeModifier } from './base.column-type-modifier.js'

export class SelectColumnTypeModifier extends BaseColumnTypeModifier<SelectField> {
  private readonly column = new UnderlyingSelectColumn(this.field.id.value, this.tableId)
  string(): void {
    const newColumn = new UnderlyingNumberColumn(this.field.id.value, this.tableId)
    const {
      properties: { key, name },
    } = this.em.getMetadata().get(Option.name)

    this.alterColumn(newColumn, this.column, (newColumn, column) => {
      const subQuery = this.em.createQueryBuilder(Option).select(['name', 'key']).from(Option).getQuery()
      return `
      UPDATE \`${this.tableId}\`
      SET ${newColumn.tempName} = \`tt\`.\`${name.fieldNames[0]}\`
      FROM (${subQuery}) as tt
      WHERE tt.\`${key.fieldNames[0]}\` = \`${this.tableId}\`.\`${column.name}\`
      `
    })
  }
  number(): void {
    const newColumn = new UnderlyingNumberColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  color(): void {
    const newColumn = new UnderlyingColorColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  email(): void {
    this.alterColumn(new UnderlyingEmailColumn(this.field.id.value, this.tableId), this.column)
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
    this.alterColumn(new UnderlyingDateColumn(this.field.id.value, this.tableId), this.column)
  }
  select(): void {
    this.alterColumn(new UnderlyingSelectColumn(this.field.id.value, this.tableId), this.column)
  }
  bool(): void {
    const newColumn = new UnderlyingBoolColumn(this.field.id.value, this.tableId)
    this.castTo('bool', newColumn, this.column)
  }
  reference(): void {
    this.dropColumn(this.column)
  }
  tree(): void {
    throw new Error('Method not implemented.')
  }
  rating(): void {
    const newColumn = new UnderlyingRatingColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  currency(): void {
    const newColumn = new UnderlyingRatingColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  attachment(): void {
    this.dropColumn(this.column)
  }
  collaborator(): void {
    this.castToCollaborator(this.column)
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
  ['multi-select'](): void {
    const newColumn = new UnderlyingMultiSelectColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column, (newColumn, column) =>
      this.knex
        .queryBuilder()
        .table(this.tableId)
        .update(newColumn.tempName, this.knex.raw(`json_array(${column.name})`))
        .toQuery(),
    )
  }
  qrcode(): void {
    this.dropColumn(this.column)
  }
  count(): void {
    this.dropColumn(this.column)
  }
  min(): void {
    this.dropColumn(this.column)
  }
  max(): void {
    this.dropColumn(this.column)
  }
  ['date-range'](): void {
    this.castToDateRange(this.column)
  }
}
