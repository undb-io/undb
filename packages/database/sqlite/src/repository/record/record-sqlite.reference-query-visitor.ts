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
  TreeField,
  UpdatedAtField,
} from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import { UnderlyingForeignTableFactory } from '../../underlying-table/undelying-foreign-table.factory.js'
import { AdjacencyListTable, ClosureTable } from '../../underlying-table/underlying-foreign-table.js'
import { getFTAlias, TABLE_ALIAS } from './record.constants.js'

export class RecordSqliteReferenceQueryVisitor implements IFieldVisitor {
  private readonly tableId: string
  constructor(
    private readonly table: Table,
    private readonly index: number,
    private readonly qb: Knex.QueryBuilder,
    private readonly knex: Knex,
  ) {
    this.tableId = table.id.value
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
    throw new Error('Method not implemented.')
  }
  reference(field: ReferenceField): void {
    const foreignTableId = this.getForeignTableId(field)
    const foreignTable = UnderlyingForeignTableFactory.create(foreignTableId, field)
    const { index } = this
    const alias = TABLE_ALIAS

    const ata = AdjacencyListTable.getAlias(index)
    const fta = getFTAlias(index)

    this.qb
      .leftJoin(
        `${foreignTable.name} as ${ata}`,
        `${alias}.${INTERNAL_COLUMN_ID_NAME}`,
        `${ata}.${AdjacencyListTable.FROM_ID}`,
      )
      .groupBy(`${alias}.${INTERNAL_COLUMN_ID_NAME}`)
      .leftJoin(
        `${foreignTableId} as ${fta}`,
        `${fta}.${INTERNAL_COLUMN_ID_NAME}`,
        `${ata}.${AdjacencyListTable.TO_ID}`,
      )
  }
  tree(field: TreeField): void {
    const foreignTableId = this.getForeignTableId(field)
    const foreignTable = UnderlyingForeignTableFactory.create(foreignTableId, field)
    const { knex, index } = this
    const alias = TABLE_ALIAS

    const cta = ClosureTable.getAlias(index)
    const fta = getFTAlias(index)

    this.qb
      .leftJoin(`${foreignTable.name} as ${cta}`, function () {
        this.on(`${alias}.${INTERNAL_COLUMN_ID_NAME}`, `${cta}.${ClosureTable.PARENT_ID}`).andOn(
          `${cta}.${ClosureTable.DEPTH}`,
          knex.raw('?', [1]),
        )
      })
      .groupBy(`${alias}.${INTERNAL_COLUMN_ID_NAME}`)
      .leftJoin(`${foreignTableId} as ${fta}`, `${fta}.${INTERNAL_COLUMN_ID_NAME}`, `${cta}.${ClosureTable.CHILD_ID}`)
  }
  parent(field: ParentField): void {
    const foreignTableId = this.getForeignTableId(field)
    const foreignTable = UnderlyingForeignTableFactory.create(foreignTableId, field)
    const { knex, index } = this
    const alias = TABLE_ALIAS

    const cta = ClosureTable.getAlias(index)
    const fta = getFTAlias(index)

    this.qb
      .leftJoin(`${foreignTable.name} as ${cta}`, function () {
        this.on(`${alias}.${INTERNAL_COLUMN_ID_NAME}`, `${cta}.${ClosureTable.CHILD_ID}`).andOn(
          `${cta}.${ClosureTable.DEPTH}`,
          knex.raw('?', [1]),
        )
      })
      .groupBy(`${alias}.${INTERNAL_COLUMN_ID_NAME}`)
      .leftJoin(`${foreignTableId} as ${fta}`, `${fta}.${INTERNAL_COLUMN_ID_NAME}`, `${cta}.${ClosureTable.PARENT_ID}`)
  }
  lookup(field: LookupField): void {
    const schema = this.table.schema.toIdMap()
    const reference = field.getReferenceField(schema)

    reference.accept(this)
  }
}
