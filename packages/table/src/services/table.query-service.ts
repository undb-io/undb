import { singleton } from "@undb/di"
import type { ITableDTO } from "../dto"
import { injectTableQueryRepository } from "../table.query-repository.provider"
import type { ITableQueryRepository } from "../table.repository"
import { getTableMethod } from "./methods/get-table.method"
import { getTablesMethod } from "./methods/get-tables.method"

export interface ITableQueryService {
  getTables(): Promise<ITableDTO[]>
  getTable(id: string): Promise<ITableDTO>
}

@singleton()
export class TableQueryService implements ITableQueryService {
  constructor(@injectTableQueryRepository() readonly repo: ITableQueryRepository) {}

  getTables = getTablesMethod
  getTable = getTableMethod
}
