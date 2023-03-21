/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AutoIncrementField,
  BoolField,
  ColorField,
  CountField,
  CreatedAtField,
  DateField,
  DateRangeField,
  EmailField,
  IAbstractReferenceField,
  IdField,
  IFieldVisitor,
  LookupField,
  NumberField,
  ParentField,
  RatingField,
  ReferenceField,
  SelectField,
  StringField,
  Table,
  TableSchemaIdMap,
  TreeField,
  UpdatedAtField,
} from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import { UnderlyingForeignTableFactory } from '../../underlying-table/undelying-foreign-table.factory.js'
import {
  AdjacencyListTable,
  ClosureTable,
  getUnderlyingTableAlias,
} from '../../underlying-table/underlying-foreign-table.js'
import { getForeignTableAlias, TABLE_ALIAS } from './record.constants.js'

export class RecordSqliteReferenceQueryVisitor implements IFieldVisitor {
  private readonly tableId: string
  private readonly schema: TableSchemaIdMap
  constructor(
    private readonly table: Table,
    private readonly qb: Knex.QueryBuilder,
    private readonly knex: Knex,
    private readonly visited: Set<string>,
  ) {
    this.tableId = table.id.value
    this.schema = table.schema.toIdMap()
  }

  private getForeignTableId(field: IAbstractReferenceField): string {
    return field.foreignTableId.unwrapOr(this.tableId)
  }

  id(value: IdField): void {
    throw new Error('Method not implemented.')
  }
  createdAt(value: CreatedAtField): void {
    throw new Error('Method not implemented.')
  }
  updatedAt(value: UpdatedAtField): void {
    throw new Error('Method not implemented.')
  }
  autoIncrement(value: AutoIncrementField): void {
    throw new Error('Method not implemented.')
  }
  rating(field: RatingField): void {
    throw new Error('Method not implemented.')
  }
  string(value: StringField): void {
    throw new Error('Method not implemented.')
  }
  email(value: EmailField): void {
    throw new Error('Method not implemented.')
  }
  color(value: ColorField): void {
    throw new Error('Method not implemented.')
  }
  number(value: NumberField): void {
    throw new Error('Method not implemented.')
  }
  bool(value: BoolField): void {
    throw new Error('Method not implemented.')
  }
  date(value: DateField): void {
    throw new Error('Method not implemented.')
  }
  dateRange(value: DateRangeField): void {
    throw new Error('Method not implemented.')
  }
  select(value: SelectField): void {
    throw new Error('Method not implemented.')
  }
  count(field: CountField): void {
    const schema = this.table.schema.toIdMap()
    const reference = field.getReferenceField(schema)

    reference.accept(this)

    const fta = getForeignTableAlias(reference, this.schema)

    this.qb.select(this.knex.raw(`count(${fta}.${INTERNAL_COLUMN_ID_NAME}) as ${field.id.value}`))
  }
  reference(field: ReferenceField): void {
    if (this.visited.has(field.id.value)) return

    const foreignTableId = this.getForeignTableId(field)
    const foreignTable = UnderlyingForeignTableFactory.create(foreignTableId, field)
    const alias = TABLE_ALIAS

    const uta = getUnderlyingTableAlias(field)
    const fta = getForeignTableAlias(field, this.schema)

    this.qb
      .leftJoin(
        `${foreignTable.name} as ${uta}`,
        `${alias}.${INTERNAL_COLUMN_ID_NAME}`,
        `${uta}.${AdjacencyListTable.FROM_ID}`,
      )
      .groupBy(`${alias}.${INTERNAL_COLUMN_ID_NAME}`)
      .leftJoin(
        `${foreignTableId} as ${fta}`,
        `${fta}.${INTERNAL_COLUMN_ID_NAME}`,
        `${uta}.${AdjacencyListTable.TO_ID}`,
      )
      .select(
        this.knex.raw(
          `json_group_array(${uta}.${AdjacencyListTable.TO_ID}) filter (where ${uta}.${AdjacencyListTable.TO_ID} is not null) as ${field.id.value}`,
        ),
      )

    this.visited.add(field.id.value)
  }
  tree(field: TreeField): void {
    if (this.visited.has(field.id.value)) return

    const foreignTableId = this.getForeignTableId(field)
    const foreignTable = UnderlyingForeignTableFactory.create(foreignTableId, field)
    const { knex } = this
    const alias = TABLE_ALIAS

    const uta = getUnderlyingTableAlias(field)
    const fta = getForeignTableAlias(field, this.schema)

    this.qb
      .leftJoin(`${foreignTable.name} as ${uta}`, function () {
        this.on(`${alias}.${INTERNAL_COLUMN_ID_NAME}`, `${uta}.${ClosureTable.PARENT_ID}`).andOn(
          `${uta}.${ClosureTable.DEPTH}`,
          knex.raw('?', [1]),
        )
      })
      .groupBy(`${alias}.${INTERNAL_COLUMN_ID_NAME}`)
      .leftJoin(`${foreignTableId} as ${fta}`, `${fta}.${INTERNAL_COLUMN_ID_NAME}`, `${uta}.${ClosureTable.CHILD_ID}`)
      .select(
        this.knex.raw(
          `json_group_array(${uta}.${ClosureTable.CHILD_ID}) filter (where ${uta}.${ClosureTable.CHILD_ID} is not null) as ${field.id.value}`,
        ),
      )

    this.visited.add(field.id.value)
  }
  parent(field: ParentField): void {
    if (this.visited.has(field.id.value)) return

    const foreignTableId = this.getForeignTableId(field)
    const foreignTable = UnderlyingForeignTableFactory.create(foreignTableId, field)
    const { knex } = this
    const alias = TABLE_ALIAS

    const uta = getUnderlyingTableAlias(field)
    const fta = getForeignTableAlias(field, this.schema)

    this.qb
      .leftJoin(`${foreignTable.name} as ${uta}`, function () {
        this.on(`${alias}.${INTERNAL_COLUMN_ID_NAME}`, `${uta}.${ClosureTable.CHILD_ID}`).andOn(
          `${uta}.${ClosureTable.DEPTH}`,
          knex.raw('?', [1]),
        )
      })
      .groupBy(`${alias}.${INTERNAL_COLUMN_ID_NAME}`)
      .leftJoin(`${foreignTableId} as ${fta}`, `${fta}.${INTERNAL_COLUMN_ID_NAME}`, `${uta}.${ClosureTable.PARENT_ID}`)
      .select(this.knex.raw(`${uta}.${ClosureTable.PARENT_ID} as ${field.id.value}`))

    this.visited.add(field.id.value)
  }
  lookup(field: LookupField): void {
    const schema = this.table.schema.toIdMap()
    const reference = field.getReferenceField(schema)

    reference.accept(this)
  }
}
