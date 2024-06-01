import { singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import type { ICreateTableDTO, ICreateTableFieldDTO, IUpdateTableFieldDTO } from "../dto"
import type { ICreateTableFormDTO } from "../modules/forms/dto/create-form.dto"
import type { ITableCreator } from "../table.builder"
import { injectTableCreator } from "../table.builder.provider"
import type { TableDo } from "../table.do"
import type { ITableRepository } from "../table.repository"
import { injectTableRepository } from "../table.repository.provider"
import { createTableFieldMethod } from "./methods/create-table-field.method"
import { createTableFormMethod } from "./methods/create-table-form.method"
import { createTableMethod } from "./methods/create-table.method"
import { updateTableFieldMethod } from "./methods/update-table-field.method"

export interface ITableService {
  createTable(dto: ICreateTableDTO): Promise<TableDo>
  createTableField(dto: ICreateTableFieldDTO): Promise<TableDo>
  updateTableField(dto: IUpdateTableFieldDTO): Promise<TableDo>
  createTableForm(dto: ICreateTableFormDTO): Promise<TableDo>
}

@singleton()
export class TableService implements ITableService {
  readonly logger = createLogger(TableService.name)

  constructor(
    @injectTableCreator() readonly creator: ITableCreator,
    @injectTableRepository() readonly repository: ITableRepository,
  ) {}

  createTable = createTableMethod
  createTableField = createTableFieldMethod
  updateTableField = updateTableFieldMethod
  createTableForm = createTableFormMethod
}
