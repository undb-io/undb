/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { INTERNAL_COLUMN_ID_NAME, type CollaboratorField } from '@undb/core'
import { User } from '../../entity/user.js'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import {
  UnderlyingBoolColumn,
  UnderlyingCollaboratorColumn,
  UnderlyingColorColumn,
  UnderlyingDateColumn,
  UnderlyingEmailColumn,
  UnderlyingJsonColumn,
  UnderlyingMultiSelectColumn,
  UnderlyingNumberColumn,
  UnderlyingRatingColumn,
  UnderlyingSelectColumn,
  UnderlyingStringColumn,
  UnderlyingUrlColumn,
} from '../underlying-column.js'
import { CollaboratorForeignTable } from '../underlying-foreign-table.js'
import { BaseColumnTypeModifier } from './base.column-type-modifier.js'

export class CollaboratorColumnTypeModifier extends BaseColumnTypeModifier<CollaboratorField> {
  private readonly column = new UnderlyingCollaboratorColumn(this.field.id.value, this.tableId)
  private collaboratorToString(newColumn: IUnderlyingColumn, field: 'username' | 'email') {
    this.alterColumn(newColumn, this.column, (newColumn, column) => {
      const { tableName, properties } = this.em.getMetadata().get(User.name)
      const { id } = properties
      const collaboratorTable = new CollaboratorForeignTable(this.tableId, this.field.id.value)

      const subQuery = this.knex
        .queryBuilder()
        .select(
          `${collaboratorTable.name}.${CollaboratorForeignTable.RECORD_ID}`,
          this.knex.raw(`group_concat(${tableName}.${properties[field].fieldNames[0]}) as value`),
        )
        .from(collaboratorTable.name)
        .leftJoin(
          tableName,
          `${tableName}.${id.fieldNames[0]}`,
          `${collaboratorTable.name}.${CollaboratorForeignTable.USER_ID}`,
        )
        .groupBy(`${collaboratorTable.name}.${CollaboratorForeignTable.RECORD_ID}`)

      return `
      UPDATE ${this.tableId}
      SET ${newColumn.name} = tt.value
      FROM (${subQuery}) as tt
      WHERE tt.${CollaboratorForeignTable.RECORD_ID} = ${this.tableId}.${INTERNAL_COLUMN_ID_NAME}
      `
    })
  }
  string(): void {
    this.collaboratorToString(new UnderlyingStringColumn(this.field.id.value, this.tableId), 'username')
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
    this.collaboratorToString(new UnderlyingEmailColumn(this.field.id.value, this.tableId), 'email')
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
    this.alterColumn(new UnderlyingBoolColumn(this.field.id.value, this.tableId), this.column)
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
    const newColumn = new UnderlyingMultiSelectColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
  }
  ['date-range'](): void {
    this.castToDateRange(this.column)
  }
}
