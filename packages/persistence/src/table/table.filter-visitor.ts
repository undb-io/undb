import type {
  ITableSpecVisitor,
  TableDo,
  TableIdSpecification,
  TableNameSpecification,
  TableSchemaSpecification,
  TableViewsSpecification,
} from '@undb/table'
import { eq } from 'drizzle-orm'
import { AbstractDBVisitor } from '../abstract-db.visitor'
import { tables } from '../tables'

export class TableFilterVisitor extends AbstractDBVisitor<TableDo> implements ITableSpecVisitor {
  withViews(views: TableViewsSpecification): void {
    throw new Error('Method not implemented.')
  }
  withId(id: TableIdSpecification): void {
    this.addCond(eq(tables.id, id.id.value))
  }
  withName(name: TableNameSpecification): void {
    this.addCond(eq(tables.name, name.name.value))
  }
  withSchema(schema: TableSchemaSpecification): void {
    throw new Error('Method not implemented.')
  }
}
