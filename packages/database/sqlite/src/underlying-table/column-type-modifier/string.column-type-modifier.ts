/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { INTERNAL_COLUMN_ID_NAME, Options, WithOptions, type StringField } from '@undb/core'
import { chain, isString } from 'lodash-es'
import { Option } from '../../entity/option.js'
import { TableSqliteMutationVisitor } from '../../repository/table/table-sqlite.mutation-visitor.js'
import {
  UnderlyingBoolColumn,
  UnderlyingColorColumn,
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

export class StringColumnTypeModifier extends BaseColumnTypeModifier<StringField> {
  private readonly column = new UnderlyingStringColumn(this.field.id.value, this.tableId)
  string(): void {
    throw new Error('Method not implemented.')
  }
  number(): void {
    const newColumn = new UnderlyingNumberColumn(this.field.id.value, this.tableId)
    this.castTo('real', newColumn, this.column)
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
    this.castToDate(this.column)
  }
  select(): void {
    this.addJobs(async () => {
      const newColumn = new UnderlyingSelectColumn(this.field.id.value, this.tableId)

      const addColumn = this.knex.schema
        .alterTable(this.tableId, (tb) => {
          newColumn.buildTemp(tb)
        })
        .toQuery()
      await this.em.execute(addColumn)

      const distinctValues = this.knex
        .select(this.column.name)
        .distinct()
        .from(this.tableId)
        .whereNotNull(this.column.name)
        .toQuery()
      const names = (await this.em.execute(distinctValues)) as { [key: string]: string }[]

      const options = Options.fromStrings(names.map((n) => n[this.column.name]?.trim() ?? '').filter(Boolean))
      if (options.options.length) {
        const spec = new WithOptions('select', this.field.id.value, options)
        const visitor = new TableSqliteMutationVisitor(this.tableId, this.em)
        spec.accept(visitor)

        await visitor.commit()

        const subQuery = this.em.qb(Option).select(['key', 'name']).getQuery()
        const query = `
        UPDATE \`${this.tableId}\`
        SET \`${newColumn.tempName}\` = \`tt\`.\`key\`
        FROM (${subQuery}) AS \`tt\`
        WHERE \`tt\`.\`name\` = \`${this.tableId}\`.\`${this.column.name}\`
      `
        await this.em.execute(query)
      }

      const dropColumn = `ALTER TABLE ${this.tableId} DROP COLUMN ${this.column.name}`

      const alterName = this.knex.schema
        .alterTable(this.tableId, (tb) => {
          tb.renameColumn(newColumn.tempName, newColumn.name)
        })
        .toQuery()

      await this.em.execute(dropColumn)
      await this.em.execute(alterName)
    })
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
    this.castTo('int', newColumn, this.column)
  }
  currency(): void {
    const newColumn = new UnderlyingRatingColumn(this.field.id.value, this.tableId)
    this.castTo('real', newColumn, this.column)
  }
  attachment(): void {
    this.dropColumn(this.column)
  }
  collaborator(): void {
    this.castToCollaborator(this.column, 'username')
  }
  count(): void {
    this.dropColumn(this.column)
  }
  ['multi-select'](): void {
    this.addJobs(async () => {
      const newColumn = new UnderlyingMultiSelectColumn(this.field.id.value, this.tableId)

      const addColumn = this.knex.schema
        .alterTable(this.tableId, (tb) => {
          newColumn.buildTemp(tb)
        })
        .toQuery()
      await this.em.execute(addColumn)

      const valuesQuery = this.knex
        .select(INTERNAL_COLUMN_ID_NAME, this.column.name)
        .from(this.tableId)
        .whereNotNull(this.column.name)
        .toQuery()

      const values = (await this.em.execute(valuesQuery)) as {
        [INTERNAL_COLUMN_ID_NAME]: string
        [key: string]: string
      }[]

      const options = Options.fromStrings(
        chain(values)
          .flatMap((n) => n[this.column.name]?.split(',').map((n) => n.trim()) ?? '')
          .filter(Boolean)
          .uniq()
          .value(),
      )
      if (options.options.length) {
        const spec = new WithOptions('multi-select', this.field.id.value, options)
        const visitor = new TableSqliteMutationVisitor(this.tableId, this.em)
        spec.accept(visitor)

        await visitor.commit()

        for (const value of values) {
          const origin = value[this.column.name]
          if (!isString(origin)) continue
          const optionIds = origin
            .split(',')
            .map((n) => n.trim())
            .map((name) => options.getByName(name).into()?.key.value)
            .filter(Boolean) as string[]
          if (!optionIds.length) continue

          const update = this.knex
            .queryBuilder()
            .table(this.tableId)
            .update(newColumn.tempName, JSON.stringify(optionIds))
            .where(INTERNAL_COLUMN_ID_NAME, value[INTERNAL_COLUMN_ID_NAME])
            .toQuery()

          await this.em.execute(update)
        }
      }

      const dropColumn = `ALTER TABLE ${this.tableId} DROP COLUMN ${this.column.name}`

      const alterName = this.knex.schema
        .alterTable(this.tableId, (tb) => {
          tb.renameColumn(newColumn.tempName, newColumn.name)
        })
        .toQuery()

      await this.em.execute(dropColumn)
      await this.em.execute(alterName)
    })
  }
  qrcode(): void {
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
