/* eslint-disable @typescript-eslint/no-unused-vars */
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type { IFieldVisitor, ParentField, ReferenceField, TreeField } from '@undb/core'
import { AbstractReferenceFieldVisitor } from '@undb/core'
import { Mixin } from 'ts-mixer'
import { AdjacencyListTable, ClosureTable } from '../../underlying-table/underlying-foreign-table.js'
import { BaseEntityManager } from '../base-entity-manager.js'

export class RecordSqliteReferenceDeleteVisitor
  extends Mixin(BaseEntityManager, AbstractReferenceFieldVisitor)
  implements IFieldVisitor
{
  private readonly knex: Knex
  constructor(
    em: EntityManager,
    private readonly foreignTableId: string,
    private readonly recordId: string,
  ) {
    super(em)
    this.knex = em.getKnex()
  }

  reference(field: ReferenceField): void {
    const foreignTable = AdjacencyListTable.fromField(this.foreignTableId, field)
    const query = this.knex.delete().from(foreignTable.name).where(AdjacencyListTable.TO_ID, this.recordId).toQuery()
    this.addQueries(query)
  }
  tree(field: TreeField): void {
    const foreignTable = new ClosureTable(this.foreignTableId, field)
    const query = this.knex.delete().from(foreignTable.name).where(ClosureTable.CHILD_ID, this.recordId).toQuery()
    this.addQueries(query)
  }
  parent(field: ParentField): void {
    const foreignTable = new ClosureTable(this.foreignTableId, field)
    const query = this.knex.delete().from(foreignTable.name).where(ClosureTable.PARENT_ID, this.recordId).toQuery()
    this.addQueries(query)
  }
}
