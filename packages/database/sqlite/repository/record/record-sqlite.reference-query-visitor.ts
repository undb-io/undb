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
import { isEmpty } from 'lodash-es'
import { ClosureTable } from '../../underlying-table/underlying-foreign-table.js'
import { getFTAlias, TABLE_ALIAS } from './record.constants.js'
import { getExpandColumnName } from './record.type.js'

const getDisplayFieldIds = (field: IReference): string[] => {
  const ids = field.displayFieldIds.map((fieldId) => fieldId.value)

  if (isEmpty(ids)) {
    return [INTERNAL_COLUMN_ID_NAME]
  }

  return ids
}

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
    throw new Error('Method not implemented.')
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

    const jsonObjectEntries: [string, string][] = getDisplayFieldIds(field).map((fieldId) => [
      `'${fieldId}'`,
      `json_group_array(${ft}.${fieldId})`,
    ])

    this.qb.select(
      knex.raw(
        `json_object('${field.id.value}',json_object(${jsonObjectEntries
          .map((k) => k.join(','))
          .join(',')})) as ${getExpandColumnName(field.id.value)}`,
      ),
    )
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

    const jsonObjectEntries: [string, string][] = getDisplayFieldIds(field).map((fieldId) => [
      `'${fieldId}'`,
      `${ft}.${fieldId}`,
    ])

    if (jsonObjectEntries.length) {
      this.qb.select(
        knex.raw(
          `json_object('${field.id.value}',json_object(${jsonObjectEntries
            .map((k) => k.join(','))
            .join(',')})) as ${getExpandColumnName(field.id.value)}`,
        ),
      )
    }
  }
}
