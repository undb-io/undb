/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AutoIncrementField,
  BoolField,
  ColorField,
  Field as CoreField,
  LookupField as CoreLookupField,
  ParentField as CoreParentField,
  ReferenceField as CoreReferenceField,
  TreeField as CoreTreeField,
  CountField,
  CreatedAtField,
  DateField,
  DateRangeField,
  EmailField,
  IFieldVisitor,
  IdField,
  NumberField,
  RatingField,
  SelectField,
  StringField,
  Table,
  UpdatedAtField,
} from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { uniqBy } from 'lodash-es'
import type { LookupField, ParentField, ReferenceField, TreeField } from '../../entity/field.js'
import type { Table as TableEntity } from '../../entity/table.js'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import {
  AdjacencyListTable,
  ClosureTable,
  getUnderlyingTableAlias,
} from '../../underlying-table/underlying-foreign-table.js'
import { TABLE_ALIAS, getForeignTableAlias } from './record.constants.js'
import { getExpandColumnName } from './record.util.js'

export class RecordSqliteReferenceManager implements IFieldVisitor {
  constructor(
    private readonly em: EntityManager,
    private readonly knex: Knex,
    private readonly qb: Knex.QueryBuilder,
    private readonly table: Table,
    private readonly tableEntity: TableEntity,
  ) {}

  #visited = new Set<string>()

  public visit(table: Table): void {
    const lookingFields = table.schema.getLookingFields()
    for (const lookingField of lookingFields) {
      lookingField.accept(this)
    }
    for (const aggregateField of table.schema.getAggregateFields()) {
      aggregateField.accept(this)
    }
    return
  }

  #mustGetColumn(field: CoreField) {
    const fieldId = field.id.value
    const columns = this.tableEntity.fields.getItems()
    const column = columns.find((c) => c.id === fieldId)
    if (!column) throw new Error('missing undelying column')

    return column
  }

  id(field: IdField): void {}
  createdAt(field: CreatedAtField): void {}
  updatedAt(field: UpdatedAtField): void {}
  autoIncrement(field: AutoIncrementField): void {}
  string(field: StringField): void {}
  email(field: EmailField): void {}
  color(field: ColorField): void {}
  number(field: NumberField): void {}
  bool(field: BoolField): void {}
  date(field: DateField): void {}
  dateRange(field: DateRangeField): void {}
  select(field: SelectField): void {}
  reference(field: CoreReferenceField): void {
    if (this.#visited.has(field.id.value)) {
      return
    }

    const column = this.#mustGetColumn(field) as ReferenceField
    const countFields = column.countFields.getItems().map((f) => f.toDomain())
    const lookupFields = column.lookupFields.getItems()
    const displayFields = column.displayFields
      .getItems()
      .concat(lookupFields.flatMap((c) => c.displayFields.getItems()))
    const displayColumns = uniqBy(displayFields, (f) => f.id).map((field) => field.toDomain())

    const foreignTableId = field.foreignTableId.unwrapOr(this.table.id.value)

    const adjacency = new AdjacencyListTable(foreignTableId, field)

    const uta = getUnderlyingTableAlias(field)
    const fta = getForeignTableAlias(field, this.table.schema.toIdMap())
    const subQuery = this.knex
      .queryBuilder()
      .select(
        AdjacencyListTable.FROM_ID,
        AdjacencyListTable.TO_ID,
        this.knex.raw(`json_group_array(${AdjacencyListTable.TO_ID}) as ${field.id.value}`),
        ...displayColumns.map((f) => this.knex.raw(`json_group_array(${fta}.${f.id.value}) as ${f.id.value}`)),
        ...countFields.map((f) => this.knex.raw(`count(*) as ${f.id.value}`)),
      )
      .from(adjacency.name)
      .groupBy(AdjacencyListTable.FROM_ID)
      .as(uta)

    const nestSubQuery = this.knex
      .queryBuilder()
      .select(
        INTERNAL_COLUMN_ID_NAME,
        ...displayColumns.map((f) =>
          f.isSystem()
            ? (UnderlyingColumnFactory.create(f, foreignTableId) as IUnderlyingColumn).name + ` as ${f.id.value}`
            : f.id.value,
        ),
      )
      .from(foreignTableId)
      .groupBy(INTERNAL_COLUMN_ID_NAME)
      .as(fta)

    subQuery.leftJoin(
      nestSubQuery,
      `${adjacency.name}.${AdjacencyListTable.TO_ID}`,
      `${fta}.${INTERNAL_COLUMN_ID_NAME}`,
    )
    this.#visited.add(field.id.value)

    const getFieldExpand = (column: ReferenceField | LookupField) =>
      this.knex.raw(
        `json_object('${column.id}', json_object(${column.displayFields
          .getItems()
          .flatMap((c) => [`'${c.id}'`, `${uta}.${c.id}`])
          .join(',')})) as ${getExpandColumnName(column.id)}`,
      )

    this.qb
      .select(
        `${uta}.${field.id.value} as ${field.id.value}`,
        getFieldExpand(column),
        ...lookupFields.map((c) => getFieldExpand(c)),
        ...countFields.map((c) => `${uta}.${c.id.value} as ${c.id.value}`),
      )
      .leftJoin(subQuery, `${uta}.${AdjacencyListTable.FROM_ID}`, `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`)
  }
  tree(field: CoreTreeField): void {
    if (this.#visited.has(field.id.value)) {
      return
    }

    const { knex } = this

    const column = this.#mustGetColumn(field) as TreeField
    const countFields = column.countFields.getItems().map((f) => f.toDomain())
    const lookupFields = column.lookupFields.getItems()
    const displayFields = column.displayFields
      .getItems()
      .concat(lookupFields.flatMap((c) => c.displayFields.getItems()))
    const displayColumns = uniqBy(displayFields, (f) => f.id).map((field) => field.toDomain())

    const foreignTableId = field.foreignTableId.unwrapOr(this.table.id.value)

    const closure = new ClosureTable(foreignTableId, field)

    const uta = getUnderlyingTableAlias(field)
    const fta = getForeignTableAlias(field, this.table.schema.toIdMap())
    const subQuery = knex
      .queryBuilder()
      .select(
        ClosureTable.PARENT_ID,
        ClosureTable.CHILD_ID,
        ClosureTable.DEPTH,
        knex.raw(`json_group_array(${ClosureTable.CHILD_ID}) as ${field.id.value}`),
        ...displayColumns.map((f) => knex.raw(`json_group_array(${fta}.${f.id.value}) as ${f.id.value}`)),
        ...countFields.map((f) => knex.raw(`count(*) as ${f.id.value}`)),
      )
      .from(closure.name)
      .groupBy(ClosureTable.PARENT_ID, ClosureTable.CHILD_ID)
      .as(uta)

    const nestSubQuery = knex
      .queryBuilder()
      .select(
        INTERNAL_COLUMN_ID_NAME,
        ...displayColumns.map((f) =>
          f.isSystem()
            ? (UnderlyingColumnFactory.create(f, foreignTableId) as IUnderlyingColumn).name + ` as ${f.id.value}`
            : f.id.value,
        ),
      )
      .from(foreignTableId)
      .groupBy(INTERNAL_COLUMN_ID_NAME)
      .as(fta)

    subQuery.leftJoin(nestSubQuery, `${closure.name}.${ClosureTable.CHILD_ID}`, `${fta}.${INTERNAL_COLUMN_ID_NAME}`)
    this.#visited.add(field.id.value)

    const getFieldExpand = (column: LookupField | TreeField) =>
      this.knex.raw(
        `json_object('${column.id}', json_object(${column.displayFields
          .getItems()
          .flatMap((c) => [`'${c.id}'`, `${uta}.${c.id}`])
          .join(',')})) as ${getExpandColumnName(column.id)}`,
      )

    this.qb
      .select(
        `${uta}.${field.id.value} as ${field.id.value}`,
        getFieldExpand(column),
        ...lookupFields.map((c) => getFieldExpand(c)),
        ...countFields.map((c) => `${uta}.${c.id.value} as ${c.id.value}`),
      )
      .leftJoin(subQuery, function () {
        this.on(`${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`, `${uta}.${ClosureTable.PARENT_ID}`).andOn(
          `${uta}.${ClosureTable.DEPTH}`,
          knex.raw('?', [1]),
        )
      })
  }
  parent(field: CoreParentField): void {
    if (this.#visited.has(field.id.value)) {
      return
    }
    const { knex } = this
    const column = this.#mustGetColumn(field) as ParentField
    const displayFields = column.displayFields.getItems()
    const displayColumns = uniqBy(displayFields, (f) => f.id).map((field) => field.toDomain())
    const foreignTableId = field.foreignTableId.unwrapOr(this.table.id.value)
    const closure = new ClosureTable(foreignTableId, field)
    const uta = getUnderlyingTableAlias(field)
    const fta = getForeignTableAlias(field, this.table.schema.toIdMap())
    const subQuery = knex
      .queryBuilder()
      .select(
        ClosureTable.PARENT_ID,
        ClosureTable.CHILD_ID,
        ClosureTable.DEPTH,
        `${ClosureTable.PARENT_ID} as ${field.id.value}`,
        ...displayColumns.map((f) => `${fta}.${f.id.value} as ${f.id.value}`),
      )
      .from(closure.name)
      .groupBy(ClosureTable.CHILD_ID, ClosureTable.PARENT_ID)
      .as(uta)

    const getFieldExpand = (column: LookupField | ParentField) =>
      knex.raw(
        `json_object('${column.id}', json_object(${column.displayFields
          .getItems()
          .flatMap((c) => [`'${c.id}'`, `${uta}.${c.id}`])
          .join(',')})) as ${getExpandColumnName(column.id)}`,
      )

    const nestSubQuery = knex
      .queryBuilder()
      .select(
        INTERNAL_COLUMN_ID_NAME,
        ...displayColumns.map((f) =>
          f.isSystem()
            ? (UnderlyingColumnFactory.create(f, foreignTableId) as IUnderlyingColumn).name + ` as ${f.id.value}`
            : f.id.value,
        ),
      )
      .from(foreignTableId)
      .groupBy(INTERNAL_COLUMN_ID_NAME)
      .as(fta)
    subQuery.leftJoin(nestSubQuery, `${closure.name}.${ClosureTable.PARENT_ID}`, `${fta}.${INTERNAL_COLUMN_ID_NAME}`)

    this.qb
      .select(`${uta}.${field.id.value} as ${field.id.value}`, getFieldExpand(column))
      .leftJoin(subQuery, function () {
        this.on(`${uta}.${ClosureTable.CHILD_ID}`, `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`).andOn(
          `${uta}.${ClosureTable.DEPTH}`,
          knex.raw('?', [1]),
        )
      })

    this.#visited.add(field.id.value)
  }
  rating(field: RatingField): void {}
  count(field: CountField): void {
    const reference = field.getReferenceField(this.table.schema.toIdMap())
    reference.accept(this)
  }
  lookup(field: CoreLookupField): void {
    const reference = field.getReferenceField(this.table.schema.toIdMap())
    reference.accept(this)
  }
}
