import type { ISpecVisitor } from '@undb/domain'
import type { TableIdSpecification } from './table-id.specification'
import type { TableNameSpecification } from './table-name.specification'
import type { TableSchemaSpecification } from './table-schema.specification'

export interface ITableSpecVisitor extends ISpecVisitor {
  withId(id: TableIdSpecification): void
  withName(name: TableNameSpecification): void
  withSchema(schema: TableSchemaSpecification): void
}
