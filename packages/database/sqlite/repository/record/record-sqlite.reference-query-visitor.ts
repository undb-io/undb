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
  ReferenceField,
  SelectField,
  StringField,
  TreeField,
  UpdatedAtField,
} from '@egodb/core'
import { INTERNAL_COLUMN_EXPAND_NAME, INTERNAL_COLUMN_ID_NAME } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import { ClosureTable } from '../../underlying-table/underlying-foreign-table'

export class RecordSqliteReferenceQueryVisitor implements IFieldVisitor {
  constructor(
    private readonly tableId: string,
    private readonly alias: string = 't',
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
  reference(value: ReferenceField): void {
    throw new Error('Method not implemented.')
  }
  tree(field: TreeField): void {
    const foreignTableId = this.getForeignTableId(field)
    const closure = new ClosureTable(foreignTableId, field)
    const { alias, knex, index } = this

    const rt = `rt${index}`
    const ft = `ft${index}`

    this.qb
      .leftJoin(`${closure.name} as ${rt}`, function () {
        this.on(`${alias}.${INTERNAL_COLUMN_ID_NAME}`, `${rt}.${ClosureTable.PARENT_ID}`).andOn(
          `${rt}.${ClosureTable.DEPTH}`,
          knex.raw('?', [1]),
        )
      })
      .groupBy(`${alias}.${INTERNAL_COLUMN_ID_NAME}`)
      .leftJoin(`${foreignTableId} as ${ft}`, `${ft}.${INTERNAL_COLUMN_ID_NAME}`, `${rt}.${ClosureTable.CHILD_ID}`)

    const jsonObjectEntries: [string, string][] = field.displayFieldIds.map((fieldId) => [
      `'${fieldId.value}'`,
      `json_group_array(${ft}.${fieldId.value})`,
    ])

    this.qb.select(
      knex.raw(
        `json_object('${field.id.value}',json_object(${jsonObjectEntries
          .map((k) => k.join(','))
          .join(',')})) as ${INTERNAL_COLUMN_EXPAND_NAME}`,
      ),
    )
  }
  parent(value: ParentField): void {}
}
