import { singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import type {
  ICreateTableDTO,
  ICreateTableFieldDTO,
  IDeleteTableDTO,
  IDeleteTableFieldDTO,
  IDuplicateTableFieldDTO,
  IUpdateTableDTO,
  IUpdateTableFieldDTO,
} from "../dto"
import {
  injectRecordQueryRepository,
  injectRecordRepository,
  type ICreateTableViewDTO,
  type IExportViewDTO,
  type IReadableRecordDTO,
  type IRecordQueryRepository,
  type IRecordRepository,
} from "../modules"
import type { ICreateTableFormDTO } from "../modules/forms/dto/create-form.dto"
import { TableCreator } from "../table.builder"
import type { TableDo } from "../table.do"
import type { ITableRepository } from "../table.repository"
import { injectTableRepository } from "../table.repository.provider"
import { createTableFieldMethod } from "./methods/create-table-field.method"
import { createTableFormMethod } from "./methods/create-table-form.method"
import { createTableViewMethod } from "./methods/create-table-view.method"
import { createTableMethod } from "./methods/create-table.method"
import { deleteTableFieldMethod } from "./methods/delete-table-field.method"
import { deleteTableMethod } from "./methods/delete-table.method"
import { duplicateTableFieldMethod } from "./methods/duplicate-table-field.method"
import { exportViewMethod } from "./methods/export-view.method"
import { updateTableFieldMethod } from "./methods/update-table-field.method"
import { updateTableMethod } from "./methods/update-table.method"

export interface ITableService {
  createTable(dto: ICreateTableDTO): Promise<TableDo>
  updateTable(dto: IUpdateTableDTO): Promise<TableDo>
  deleteTable(dto: IDeleteTableDTO): Promise<TableDo>

  createTableField(dto: ICreateTableFieldDTO): Promise<TableDo>
  updateTableField(dto: IUpdateTableFieldDTO): Promise<TableDo>
  deleteTableField(dto: IDeleteTableFieldDTO): Promise<TableDo>
  duplicateTableField(dto: IDuplicateTableFieldDTO): Promise<TableDo>

  createTableForm(dto: ICreateTableFormDTO): Promise<TableDo>
  createTableView(dto: ICreateTableViewDTO): Promise<TableDo>

  exportView(tableId: string, dto: IExportViewDTO): Promise<{ table: TableDo; records: IReadableRecordDTO[] }>
}

@singleton()
export class TableService implements ITableService {
  readonly logger = createLogger(TableService.name)

  public get creator() {
    return new TableCreator()
  }

  constructor(
    @injectTableRepository()
    public readonly repository: ITableRepository,
    @injectRecordRepository()
    public readonly recordRepository: IRecordRepository,
    @injectRecordQueryRepository()
    public readonly recordQueryRepository: IRecordQueryRepository,
  ) {}

  createTable = createTableMethod
  updateTable = updateTableMethod
  deleteTable = deleteTableMethod

  createTableField = createTableFieldMethod
  deleteTableField = deleteTableFieldMethod
  duplicateTableField = duplicateTableFieldMethod
  updateTableField = updateTableFieldMethod

  createTableForm = createTableFormMethod
  createTableView = createTableViewMethod

  exportView = exportViewMethod
}