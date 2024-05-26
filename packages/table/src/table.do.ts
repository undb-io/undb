import { AggregateRoot } from "@undb/domain"
import type { ITableDTO } from "./dto"
import type { ITableEvents } from "./events"
import { createFieldMethod } from "./methods/create-field.method"
import { setTableRLS } from "./methods/set-table-rls.method"
import { setViewAggregate } from "./methods/set-view-aggregate.method"
import { setViewColor } from "./methods/set-view-color.method"
import { setViewFilter } from "./methods/set-view-filter.method"
import { setViewSort } from "./methods/set-view-sort.method"
import type { TableRSL } from "./modules"
import type { Schema } from "./modules/schema/schema.vo"
import type { Views } from "./modules/views/views.vo"
import type { TableId } from "./table-id.vo"
import type { TableNameVo } from "./table-name.vo"
import type { FormsVO } from "./modules/forms/forms.vo"
import { createFormMethod } from "./methods/create-form.method"

export class TableDo extends AggregateRoot<ITableEvents> {
  public id!: TableId
  public name!: TableNameVo
  public schema!: Schema
  public views!: Views
  public forms?: FormsVO
  public rls!: TableRSL

  $setViewFilter = setViewFilter
  $setViewColor = setViewColor
  $setViewSort = setViewSort
  $setTableRLS = setTableRLS
  $setViewAggregate = setViewAggregate
  $createField = createFieldMethod
  $createForm = createFormMethod

  getOrderedFields() {
    return this.schema.fields
  }

  toJSON(): ITableDTO {
    return {
      id: this.id.value,
      name: this.name.value,
      schema: this.schema.toJSON(),
      views: this.views.toJSON(),
      rls: this.rls?.toJSON(),
      forms: this.forms?.toJSON(),
    }
  }
}
