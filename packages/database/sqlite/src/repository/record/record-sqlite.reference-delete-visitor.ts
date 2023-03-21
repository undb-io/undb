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
  IFieldVisitor,
  IdField,
  LookupField,
  NumberField,
  ParentField,
  RatingField,
  ReferenceField,
  SelectField,
  StringField,
  TreeField,
  UpdatedAtField,
} from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type { Table as TableEntity } from '../../entity/table.js'
import { AdjacencyListTable, ClosureTable } from '../../underlying-table/underlying-foreign-table.js'
import { BaseEntityManager } from '../base-entity-manager.js'

export class RecordSqliteReferenceDleteVisitor extends BaseEntityManager implements IFieldVisitor {
  private readonly knex: Knex
  constructor(em: EntityManager, private readonly tableEntity: TableEntity, private readonly recordId: string) {
    super(em)
    this.knex = em.getKnex()
  }

  id(field: IdField): void {
    throw new Error('Method not implemented.')
  }
  createdAt(field: CreatedAtField): void {
    throw new Error('Method not implemented.')
  }
  updatedAt(field: UpdatedAtField): void {
    throw new Error('Method not implemented.')
  }
  autoIncrement(field: AutoIncrementField): void {
    throw new Error('Method not implemented.')
  }
  string(field: StringField): void {
    throw new Error('Method not implemented.')
  }
  email(field: EmailField): void {
    throw new Error('Method not implemented.')
  }
  color(field: ColorField): void {
    throw new Error('Method not implemented.')
  }
  number(field: NumberField): void {
    throw new Error('Method not implemented.')
  }
  bool(field: BoolField): void {
    throw new Error('Method not implemented.')
  }
  date(field: DateField): void {
    throw new Error('Method not implemented.')
  }
  dateRange(field: DateRangeField): void {
    throw new Error('Method not implemented.')
  }
  select(field: SelectField): void {
    throw new Error('Method not implemented.')
  }
  reference(field: ReferenceField): void {
    const foreignTable = new AdjacencyListTable(this.tableEntity.id, field)
    const query = this.knex.delete().from(foreignTable.name).where(AdjacencyListTable.TO_ID, this.recordId).toQuery()
    this.addQueries(query)
  }
  tree(field: TreeField): void {
    const foreignTable = new ClosureTable(this.tableEntity.id, field)
    const query = this.knex.delete().from(foreignTable.name).where(ClosureTable.CHILD_ID, this.recordId).toQuery()
    this.addQueries(query)
  }
  parent(field: ParentField): void {
    const foreignTable = new ClosureTable(this.tableEntity.id, field)
    const query = this.knex.delete().from(foreignTable.name).where(ClosureTable.PARENT_ID, this.recordId).toQuery()
    this.addQueries(query)
  }
  rating(field: RatingField): void {
    throw new Error('Method not implemented.')
  }
  count(field: CountField): void {
    throw new Error('Method not implemented.')
  }
  lookup(field: LookupField): void {
    throw new Error('Method not implemented.')
  }
}
