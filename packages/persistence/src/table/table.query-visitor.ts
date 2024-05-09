import type {
  ITableSpecVisitor,
  TableDo,
  TableIdSpecification,
  TableNameSpecification,
  TableSchemaSpecification,
} from '@undb/table'
import { eq } from 'drizzle-orm'
import { AbstractDBVisitor } from '../abstract-db.visitor'
import { tables } from '../tables'

export class TableQueryVisitor extends AbstractDBVisitor<TableDo> implements ITableSpecVisitor {
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
