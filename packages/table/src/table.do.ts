import { AggregateRoot } from "@undb/domain"
import type { ITableDTO } from "./dto"
import type { ITableEvents } from "./events"
import { setTableRLS } from "./methods/set-table-rls.method"
import { setViewColor } from "./methods/set-view-color.method"
import { setViewFilter } from "./methods/set-view-filter.method"
import type { TableRSL } from "./modules"
import type { Schema } from "./modules/schema/schema.vo"
import type { Views } from "./modules/views/views.vo"
import type { TableId } from "./table-id.vo"
import type { TableNameVo } from "./table-name.vo"

export class TableDo extends AggregateRoot<ITableEvents> {
  public id!: TableId
  public name!: TableNameVo
  public schema!: Schema
  public views!: Views
  public rls!: TableRSL

  $setViewFilter = setViewFilter
  $setViewColor = setViewColor
  $setTableRLS = setTableRLS

  getOrderedFields() {
    return this.schema.fields
  }

  toJSON(): ITableDTO {
    return {
      id: this.id.value,
      name: this.name.value,
      schema: this.schema.toJSON(),
      views: this.views.toJSON(),
      rls: this.rls.toJSON(),
    }
  }
}
