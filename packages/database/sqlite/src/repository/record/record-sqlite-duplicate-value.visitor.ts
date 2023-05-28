/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type {
  AttachmentField,
  AutoIncrementField,
  AverageField,
  BoolField,
  CollaboratorField,
  ColorField,
  CountField,
  CreatedAtField,
  CreatedByField,
  CurrencyField,
  DateField,
  EmailField,
  Field,
  IFieldVisitor,
  IdField,
  LookupField,
  MultiSelectField,
  NumberField,
  ParentField,
  RatingField,
  SelectField,
  StringField,
  SumField,
  UpdatedAtField,
  UpdatedByField,
} from '@undb/core'
import { DateRangeField, INTERNAL_COLUMN_ID_NAME, ReferenceField, TreeField, isSelectFieldType } from '@undb/core'
import {
  UnderlyingDateRangeFromColumn,
  UnderlyingDateRangeToColumn,
  UnderlyingMultiSelectColumn,
  UnderlyingSelectColumn,
} from '../../underlying-table/underlying-column.js'
import { AdjacencyListTable, ClosureTable } from '../../underlying-table/underlying-foreign-table.js'
import { UnderlyingTempDuplicateOptionTable } from '../../underlying-table/underlying-temp-duplicate-option-table.js'
import { BaseEntityManager } from '../base-entity-manager.js'

export class RecordSqliteDuplicateValueVisitor extends BaseEntityManager implements IFieldVisitor {
  constructor(
    private readonly tableId: string,
    private readonly from: Field,
    em: EntityManager,
    private readonly qb: Knex.QueryBuilder,
    private readonly knex: Knex,
  ) {
    super(em)
  }

  id(field: IdField): void {
    throw new Error('Method not implemented.')
  }
  createdAt(field: CreatedAtField): void {
    throw new Error('Method not implemented.')
  }
  createdBy(field: CreatedByField): void {
    throw new Error('Method not implemented.')
  }
  updatedAt(field: UpdatedAtField): void {
    throw new Error('Method not implemented.')
  }
  updatedBy(field: UpdatedByField): void {
    throw new Error('Method not implemented.')
  }
  attachment(field: AttachmentField): void {
    throw new Error('Method not implemented.')
  }
  autoIncrement(field: AutoIncrementField): void {
    throw new Error('Method not implemented.')
  }
  string(field: StringField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  email(field: EmailField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  color(field: ColorField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  number(field: NumberField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  bool(field: BoolField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  date(field: DateField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  dateRange(field: DateRangeField): void {
    if (!(this.from instanceof DateRangeField)) return

    const fromColumn = new UnderlyingDateRangeFromColumn(this.from, this.tableId)
    const newFromColumn = new UnderlyingDateRangeFromColumn(field, this.tableId)
    this.addQueries(`UPDATE ${this.tableId} SET ${newFromColumn.name} = ${fromColumn.name}`)

    const toColumn = new UnderlyingDateRangeToColumn(this.from, this.tableId)
    const newToColumn = new UnderlyingDateRangeToColumn(field, this.tableId)
    this.addQueries(`UPDATE ${this.tableId} SET ${newToColumn.name} = ${toColumn.name}`)
  }
  select(field: SelectField): void {
    if (!isSelectFieldType(this.from)) return

    const temp = new UnderlyingTempDuplicateOptionTable(this.tableId, this.from, field, this.knex)

    const underlyingColumn = new UnderlyingSelectColumn(field, this.tableId)

    const query = `
      UPDATE \`${this.tableId}\`
      SET ${underlyingColumn.name} = tt.\`${UnderlyingTempDuplicateOptionTable.TO_FIELD}\`
      FROM ${temp.name} as tt
      WHERE ${this.from.id.value} = tt.\`${UnderlyingTempDuplicateOptionTable.FROM_FIELD}\`
    `

    this.addQueries(query)
  }
  multiSelect(field: MultiSelectField): void {
    if (!isSelectFieldType(this.from)) return
    const temp = new UnderlyingTempDuplicateOptionTable(this.tableId, this.from, field, this.knex)
    const underlyingColumn = new UnderlyingMultiSelectColumn(field, this.tableId)

    const subQuery = this.knex
      .queryBuilder()
      .select(
        `${this.tableId}.${INTERNAL_COLUMN_ID_NAME}`,
        this.knex.raw(
          `json_group_array(${temp.name}.\`${UnderlyingTempDuplicateOptionTable.TO_FIELD}\`) as ${UnderlyingTempDuplicateOptionTable.TO_FIELD}`,
        ),
      )
      .fromRaw(`${this.tableId}, json_each(${this.from.id.value})`)
      .leftJoin(temp.name, `${temp.name}.${UnderlyingTempDuplicateOptionTable.FROM_FIELD}`, `json_each.value`)
      .groupBy(`${this.tableId}.${INTERNAL_COLUMN_ID_NAME}`)
      .toQuery()

    const query = `
      UPDATE \`${this.tableId}\`
      SET ${underlyingColumn.name} = tt.\`${UnderlyingTempDuplicateOptionTable.TO_FIELD}\`
      FROM (${subQuery}) as tt
      WHERE tt.id = ${this.tableId}.id
    `
    this.addQueries(query)
  }
  reference(field: ReferenceField): void {
    if (!(this.from instanceof ReferenceField)) return

    const oldTable = new AdjacencyListTable(this.tableId, this.from)
    const adjacencyListTable = new AdjacencyListTable(this.tableId, field)

    const query = this.knex
      .queryBuilder()
      .insert(this.knex.queryBuilder().select('*').from(oldTable.name))
      .into(adjacencyListTable.name)
      .toQuery()

    this.addQueries(query)
  }
  tree(field: TreeField): void {
    if (!(this.from instanceof TreeField)) return
    const oldTable = new ClosureTable(this.tableId, this.from)
    const closureTable = new ClosureTable(this.tableId, field)

    const query = this.knex
      .queryBuilder()
      .insert(this.knex.queryBuilder().select('*').from(oldTable.name))
      .into(closureTable.name)
      .toQuery()
    this.addQueries(query)
  }
  parent(field: ParentField): void {
    throw new Error('Method not implemented.')
  }
  rating(field: RatingField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  currency(field: CurrencyField): void {
    this.addQueries(`UPDATE ${this.tableId} SET ${field.id.value} = ${this.from.id.value}`)
  }
  count(field: CountField): void {}
  sum(field: SumField): void {}
  average(field: AverageField): void {}
  lookup(field: LookupField): void {}
  collaborator(field: CollaboratorField): void {
    throw new Error('Method not implemented.')
  }
}
