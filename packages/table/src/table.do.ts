import { AggregateRoot } from "@undb/domain"
import type { ITableDTO } from "./dto"
import type { ITableEvents } from "./events"
import { setViewFilter } from "./methods/set-view-filter.method"
import type { Schema } from "./modules/schema/schema.vo"
import type { Views } from "./modules/views/views.vo"
import type { TableId } from "./table-id.vo"
import type { TableNameVo } from "./table-name.vo"
import { setViewColor } from "./methods/set-view-color.method"

export class TableDo extends AggregateRoot<ITableEvents> {
  public id!: TableId
  public name!: TableNameVo
  public schema!: Schema
  public views!: Views

  $setViewFilter = setViewFilter
  $setViewColor = setViewColor

  toJSON(): ITableDTO {
    return {
      id: this.id.value,
      name: this.name.value,
      schema: this.schema.toJSON(),
      views: this.views.toJSON(),
    }
  }
}
