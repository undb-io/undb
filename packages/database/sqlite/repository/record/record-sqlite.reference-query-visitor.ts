/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type {
  AutoIncrementField,
  BoolField,
  ColorField,
  CreatedAtField,
  DateField,
  DateRangeField,
  EmailField,
  IdField,
  IFieldVisitor,
  IReference,
  NumberField,
  ParentField,
  RatingField,
  ReferenceField,
  SelectField,
  StringField,
  TreeField,
  UpdatedAtField,
} from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import { AdjacencyListTable, ClosureTable } from '../../underlying-table/underlying-foreign-table.js'
import { getFTAlias, TABLE_ALIAS } from './record.constants.js'
import { expandField } from './record.util.js'

export class RecordSqliteReferenceQueryVisitor implements IFieldVisitor {
  constructor(
    private readonly tableId: string,
    private readonly index: number,
    private readonly qb: Knex.QueryBuilder,
    private readonly knex: Knex,
  ) {}
  private getForeignTableId(field: IReference): string {
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
  reference(field: ReferenceField): void {
    const foreignTableId = this.getForeignTableId(field)
    const adjacency = new AdjacencyListTable(this.tableId, field)
    const { knex, index } = this
    const alias = TABLE_ALIAS

    const at = AdjacencyListTable.getAlias(index)
    const ft = getFTAlias(index)

    this.qb
      .leftJoin(
        `${adjacency.name} as ${at}`,
        `${alias}.${INTERNAL_COLUMN_ID_NAME}`,
        `${at}.${AdjacencyListTable.FROM_ID}`,
      )
      .groupBy(`${alias}.${INTERNAL_COLUMN_ID_NAME}`)
      .leftJoin(`${foreignTableId} as ${ft}`, `${ft}.${INTERNAL_COLUMN_ID_NAME}`, `${at}.${AdjacencyListTable.TO_ID}`)

    expandField(field, ft, knex, this.qb, true)
  }
  tree(field: TreeField): void {
    const foreignTableId = this.getForeignTableId(field)
    const closure = new ClosureTable(foreignTableId, field)
    const { knex, index } = this
    const alias = TABLE_ALIAS

    const ct = ClosureTable.getAlias(index)
    const ft = getFTAlias(index)

    this.qb
      .leftJoin(`${closure.name} as ${ct}`, function () {
        this.on(`${alias}.${INTERNAL_COLUMN_ID_NAME}`, `${ct}.${ClosureTable.PARENT_ID}`).andOn(
          `${ct}.${ClosureTable.DEPTH}`,
          knex.raw('?', [1]),
        )
      })
      .groupBy(`${alias}.${INTERNAL_COLUMN_ID_NAME}`)
      .leftJoin(`${foreignTableId} as ${ft}`, `${ft}.${INTERNAL_COLUMN_ID_NAME}`, `${ct}.${ClosureTable.CHILD_ID}`)

    expandField(field, ft, knex, this.qb, true)
  }
  parent(field: ParentField): void {
    const foreignTableId = this.getForeignTableId(field)
    const closure = new ClosureTable(foreignTableId, field)
    const { knex, index } = this
    const alias = TABLE_ALIAS

    const ct = ClosureTable.getAlias(index)
    const ft = getFTAlias(index)

    this.qb
      .leftJoin(`${closure.name} as ${ct}`, function () {
        this.on(`${alias}.${INTERNAL_COLUMN_ID_NAME}`, `${ct}.${ClosureTable.CHILD_ID}`).andOn(
          `${ct}.${ClosureTable.DEPTH}`,
          knex.raw('?', [1]),
        )
      })
      .groupBy(`${alias}.${INTERNAL_COLUMN_ID_NAME}`)
      .leftJoin(`${foreignTableId} as ${ft}`, `${ft}.${INTERNAL_COLUMN_ID_NAME}`, `${ct}.${ClosureTable.PARENT_ID}`)

    expandField(field, ft, knex, this.qb)
  }
}
