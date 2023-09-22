/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { INTERNAL_COLUMN_ID_NAME, type AttachmentField } from '@undb/core'
import { Attachment } from '../../entity/attachment.js'
import {
  UnderlyingAttachmentColumn,
  UnderlyingBoolColumn,
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
import { BaseColumnTypeModifier } from './base.column-type-modifier.js'

export class AttachmentColumnTypeModifier extends BaseColumnTypeModifier<AttachmentField> {
  private readonly column = new UnderlyingAttachmentColumn(this.field.id.value, this.tableId)
  string(): void {
    const newColumn = new UnderlyingStringColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)

    const {
      tableName: attachmentTableName,
      properties: { recordId, name, fieldId },
    } = this.em.getMetadata().get(Attachment.name)

    const { tableId, knex, field } = this
    const subQuery = this.knex
      .queryBuilder()
      .select(
        `${attachmentTableName}.${recordId.fieldNames[0]}`,
        this.knex.raw(`group_concat(distinct ${attachmentTableName}.${name.fieldNames[0]}) as value`),
      )
      .from(this.tableId)
      .innerJoin(attachmentTableName, function () {
        this.on(`${attachmentTableName}.${recordId.fieldNames[0]}`, `${tableId}.${INTERNAL_COLUMN_ID_NAME}`).andOn(
          `${attachmentTableName}.${fieldId.fieldNames[0]}`,
          knex.raw('?', [field.id.value]),
        )
      })
      .groupBy(`${attachmentTableName}.${recordId.fieldNames[0]}`)
      .toQuery()

    const query = `
      UPDATE \`${this.tableId}\`
      SET ${newColumn.name} = tt.value
      FROM (${subQuery}) as tt
      WHERE tt.${recordId.fieldNames[0]} = ${this.tableId}.id
    `
    this.addQueries(query)
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
    this.alterColumn(newColumn, this.column)
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
  ['multi-select'](): void {
    const newColumn = new UnderlyingMultiSelectColumn(this.field.id.value, this.tableId)
    this.alterColumn(newColumn, this.column)
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
  ['date-range'](): void {
    this.castToDateRange(this.column)
  }
}
