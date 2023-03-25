/* eslint-disable @typescript-eslint/no-unused-vars */
import type { IFieldVisitor, ParentField, ReferenceField, TreeField } from '@egodb/core'
import { AbstractReferenceFieldVisitor } from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { Mixin } from 'ts-mixer'
import type { Table as TableEntity } from '../../entity/table.js'
import { AdjacencyListTable, ClosureTable } from '../../underlying-table/underlying-foreign-table.js'
import { BaseEntityManager } from '../base-entity-manager.js'

export class RecordSqliteReferenceDeleteVisitor
  extends Mixin(BaseEntityManager, AbstractReferenceFieldVisitor)
  implements IFieldVisitor
{
  private readonly knex: Knex
  constructor(em: EntityManager, private readonly tableEntity: TableEntity, private readonly recordId: string) {
    super(em)
    this.knex = em.getKnex()
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
}
