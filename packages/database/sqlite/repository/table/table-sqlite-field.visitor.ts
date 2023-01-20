import type {
  BoolField as CoreBoolField,
  DateField as CoreDateField,
  DateRangeField as CoreDateRangeField,
  IFieldVisitor,
  NumberField as CoreNumberField,
  ReferenceField as CoreReferenceField,
  SelectField as CoreSelectField,
  StringField as CoreStringField,
  TreeField as CoreTreeField,
} from '@egodb/core'
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
  TreeField,
} from '../../entity'
import { UnderlyingAdjacencyListTable, UnderlyingClosureTable } from '../../underlying-table/underlying-foreign-table'

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

    const adjacencyListTable = new UnderlyingAdjacencyListTable(this.table.id, value)

    const queries = adjacencyListTable.getSqls(this.em.getKnex())

    this.queries.push(...queries)
  }

  tree(value: CoreTreeField): void {
    const field = new TreeField(this.table, value)
    this.em.persist(field)

    const closureTable = new UnderlyingClosureTable(this.table.id, value)

    const queries = closureTable.getSqls(this.em.getKnex())
    this.queries.push(...queries)
  }
}
