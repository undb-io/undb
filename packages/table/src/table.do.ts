import type { Schema } from './modules/schema/schema.vo'
import type { TableId } from './table-id.vo'
import type { TableNameVo } from './table-name.vo'

export class TableDo {
  public id!: TableId
  public name!: TableNameVo
  public schema!: Schema
}
