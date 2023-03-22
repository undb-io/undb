/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AutoIncrementField,
  BoolField,
  ColorField,
  ReferenceField as CoreReferenceField,
  CountField,
  CreatedAtField,
  DateField,
  DateRangeField,
  EmailField,
  IFieldVisitor,
  IdField,
  LookupField,
  NumberField,
  ParentField,
  RatingField,
  SelectField,
  StringField,
  Table,
  TreeField,
  UpdatedAtField,
} from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type { ReferenceField } from '../../entity/field.js'
import type { Table as TableEntity } from '../../entity/table.js'
import type { IUnderlyingColumn } from '../../interfaces/underlying-column.js'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { AdjacencyListTable, getUnderlyingTableAlias } from '../../underlying-table/underlying-foreign-table.js'
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

  #subQueries = new Map<string, Knex.QueryBuilder>()

  public visit(table: Table): void {
    const lookingFields = table.schema.getLookingFields()
    for (const lookingField of lookingFields) {
      lookingField.accept(this)
    }
    return
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
    if (this.#subQueries.has(field.id.value)) {
      return
    }

    const columns = this.tableEntity.fields.getItems()
    const column = columns.find((c) => c.id === field.id.value)
    if (!column) throw new Error('missing undelying column')

    const foreignTableId = field.foreignTableId.unwrapOr(this.table.id.value)

    const expandColumnName = getExpandColumnName(field.id.value)
    const adjacency = new AdjacencyListTable(foreignTableId, field)

    const displayColumns = (column as ReferenceField).displayFields.getItems().map((field) => field.toDomain())

    const uta = getUnderlyingTableAlias(field)
    const fta = getForeignTableAlias(field, this.table.schema.toIdMap())
    const subQuery = this.knex
      .queryBuilder()
      .select(
        AdjacencyListTable.FROM_ID,
        AdjacencyListTable.TO_ID,
        this.knex.raw(`json_group_array(${AdjacencyListTable.TO_ID}) as ${field.id.value}`),
        ...displayColumns.map((f) => this.knex.raw(`json_group_array(${fta}.${f.id.value}) as ${f.id.value}`)),
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
    this.#subQueries.set(field.id.value, subQuery)

    const select = displayColumns.flatMap((c) => [`'${c.id.value}'`, `${uta}.${c.id.value}`]).join(',')
    this.qb
      .select(
        `${uta}.${field.id.value} as ${field.id.value}`,
        this.knex.raw(`json_object('${field.id.value}', json_object(${select})) as ${expandColumnName}`),
      )
      .leftJoin(subQuery, `${uta}.${AdjacencyListTable.FROM_ID}`, `${TABLE_ALIAS}.${INTERNAL_COLUMN_ID_NAME}`)
  }
  tree(field: TreeField): void {
    throw new Error('Method not implemented.')
  }
  parent(field: ParentField): void {
    throw new Error('Method not implemented.')
  }
  rating(field: RatingField): void {}
  count(field: CountField): void {
    const reference = field.getReferenceField(this.table.schema.toIdMap())
    reference.accept(this)
  }
  lookup(field: LookupField): void {
    const reference = field.getReferenceField(this.table.schema.toIdMap())
    reference.accept(this)
  }
}
