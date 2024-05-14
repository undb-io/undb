import type { ISpecVisitor } from "@undb/domain"
import type { TableIdSpecification } from "./table-id.specification"
import type { TableNameSpecification } from "./table-name.specification"
import type { TableSchemaSpecification } from "./table-schema.specification"
import type { WithViewFilter } from "./table-view.specification"
import type { TableViewsSpecification } from "./table-views.specification"

export interface ITableSpecVisitor extends ISpecVisitor {
  withId(id: TableIdSpecification): void
  withName(name: TableNameSpecification): void
  withSchema(schema: TableSchemaSpecification): void
  withViews(views: TableViewsSpecification): void
  withViewFilter(viewFilter: WithViewFilter): void
}
