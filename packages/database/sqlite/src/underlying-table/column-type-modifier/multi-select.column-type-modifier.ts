/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { INTERNAL_COLUMN_ID_NAME, type MultiSelectField } from '@undb/core'
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

export class MultiSelectColumnTypeModifier extends BaseColumnTypeModifier<MultiSelectField> {
  private readonly column = new UnderlyingMultiSelectColumn(this.field.id.value, this.tableId)
  string(): void {
    const newColumn = new UnderlyingNumberColumn(this.field.id.value, this.tableId)
    const {
      tableName: optionTableName,
      properties: { key, name },
    } = this.em.getMetadata().get(Option.name)

    this.alterColumn(newColumn, this.column, (newColumn, column) => {
      const subQuery = this.knex
        .queryBuilder()
        .select(
          `${this.tableId}.${INTERNAL_COLUMN_ID_NAME}`,
          this.knex.raw(`group_concat(${optionTableName}.\`${name.fieldNames[0]}\`) as value`),
        )
        .fromRaw(`${this.tableId}, json_each(${column.name})`)
        .leftJoin(optionTableName, `${optionTableName}.${key.fieldNames[0]}`, `json_each.value`)
        .groupBy(`${this.tableId}.${INTERNAL_COLUMN_ID_NAME}`)
        .toQuery()

      return `
      UPDATE \`${this.tableId}\`
      SET ${newColumn.tempName} = \`tt\`.\`value\`
      FROM (${subQuery}) as tt
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
    this.alterColumn(
      new UnderlyingSelectColumn(this.field.id.value, this.tableId),
      this.column,
      (newColumn, column) => {
        const subQuery = this.knex
          .queryBuilder()
          .select(`${this.tableId}.${INTERNAL_COLUMN_ID_NAME}`, `json_each.value as value`)
          .fromRaw(`${this.tableId}, json_each(${column.name})`)
          .groupBy(`${this.tableId}.${INTERNAL_COLUMN_ID_NAME}`)
          .toQuery()

        return `
          UPDATE \`${this.tableId}\`
          SET ${newColumn.tempName} = \`tt\`.\`value\`
          FROM (${subQuery}) as tt
          `
      },
    )
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
  qrcode(): void {
    this.dropColumn(this.column)
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
    this.dropColumn(this.column)
  }
  max(): void {
    this.dropColumn(this.column)
  }
  ['multi-select'](): void {
    throw new Error('Method not implemented.')
  }
  ['date-range'](): void {
    this.castToDateRange(this.column)
  }
}
