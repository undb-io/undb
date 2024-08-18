import { singleton } from "@undb/di"
import type { ITableDTO } from "../dto"
import { injectTableQueryRepository } from "../table.query-repository.provider"
import type { ITableQueryRepository } from "../table.repository"
import { getRollupForeignTablesMethod } from "./methods/get-rollup-foreign-tables.method"
import { getTableForeignTablesMethod } from "./methods/get-table-foreign-tables.method"
import { getTableMethod } from "./methods/get-table.method"
import { getTablesMethod } from "./methods/get-tables.method"

export interface ITableQueryService {
  getTables(baseId?: string): Promise<ITableDTO[]>
  getRollupForeignTables(tableId: string, fieldId: string): Promise<ITableDTO[]>
  getTableForeignTables(tableId: string): Promise<ITableDTO[]>
  getTable(id: string): Promise<ITableDTO>
}

@singleton()
export class TableQueryService implements ITableQueryService {
  constructor(@injectTableQueryRepository() readonly repo: ITableQueryRepository) {}

  getTables = getTablesMethod
  getTable = getTableMethod
  getTableForeignTables = getTableForeignTablesMethod
  getRollupForeignTables = getRollupForeignTablesMethod
}
