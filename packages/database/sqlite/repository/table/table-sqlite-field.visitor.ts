import type {
  BoolField as CoreBoolField,
  DateField as CoreDateField,
  DateRangeField as CoreDateRangeField,
  IFieldVisitor,
  NumberField as CoreNumberField,
  ReferenceField as CoreReferenceField,
  SelectField as CoreSelectField,
  StringField as CoreStringField,
} from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type { Table } from '../../entity'
import {
  BoolField,
  DateField,
  DateRangeField,
  NumberField,
  Option,
  ReferenceField,
  SelectField,
  StringField,
} from '../../entity'
import { M2M_CHILD_ID_FIELD, M2M_PARENG_ID_FIELD } from '../../underlying-table/constants'
import { UnderlyingM2MTable } from '../../underlying-table/underlying-table'

export class TableSqliteFieldVisitor implements IFieldVisitor {
  constructor(private readonly table: Table, private readonly em: EntityManager) {}

  private queries: string[] = []

  public async commit(): Promise<void> {
    for (const query of this.queries) {
      await this.em.execute(query)
    }
  }

  string(value: CoreStringField): void {
    const field = new StringField(this.table, value)

    this.em.persist(field)
  }

  number(value: CoreNumberField): void {
    const field = new NumberField(this.table, value)

    this.em.persist(field)
  }

  bool(value: CoreBoolField): void {
    const field = new BoolField(this.table, value)

    this.em.persist(field)
  }

  date(value: CoreDateField): void {
    const field = new DateField(this.table, value)

    this.em.persist(field)
  }

  dateRange(value: CoreDateRangeField): void {
    const field = new DateRangeField(this.table, value)

    this.em.persist(field)
  }

  select(value: CoreSelectField): void {
    const field = new SelectField(this.table, value)
    wrap(field).assign({ options: value.options.options.map((option) => new Option(field, option)) })
    this.em.persist(field)
  }

  reference(value: CoreReferenceField): void {
    const field = new ReferenceField(this.table, value)
    this.em.persist(field)

    const underlyingTable = new UnderlyingM2MTable(this.table.id, value)
    const refenrenceTableName = underlyingTable.name

    const query = this.em
      .getKnex()
      .schema.createTable(refenrenceTableName, (tb) => {
        tb.string(M2M_CHILD_ID_FIELD).notNullable().references(INTERNAL_COLUMN_ID_NAME).inTable(this.table.id)
        tb.string(M2M_PARENG_ID_FIELD).notNullable().references(INTERNAL_COLUMN_ID_NAME).inTable(this.table.id)
        tb.primary([M2M_CHILD_ID_FIELD, M2M_PARENG_ID_FIELD])
      })
      .toQuery()

    this.queries.push(query)
  }
}
