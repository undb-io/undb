import { AggregateRoot } from "@undb/domain"
import { setViewFilter } from "./methods/set-view-filter.method"
import type { Schema } from "./modules/schema/schema.vo"
import type { Views } from "./modules/views/views.vo"
import type { TableId } from "./table-id.vo"
import type { TableNameVo } from "./table-name.vo"

export class TableDo extends AggregateRoot {
  public id!: TableId
  public name!: TableNameVo
  public schema!: Schema
  public views!: Views

  $setViewFilter = setViewFilter
}
