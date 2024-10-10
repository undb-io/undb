import { injectBaseRepository, type Base, type IBaseRepository, type IDuplicateBaseDTO } from "@undb/base"
import { singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import type { ISpaceId } from "@undb/space"
import type {
  ICreateTableDTO,
  ICreateTableFieldDTO,
  IDeleteTableDTO,
  IDeleteTableFieldDTO,
  IDuplicateTableDTO,
  IDuplicateTableFieldDTO,
  IUpdateTableDTO,
  IUpdateTableFieldDTO,
} from "../dto"
import {
  FormVO,
  injectRecordQueryRepository,
  injectRecordRepository,
  type ICreateTableViewDTO,
  type IDeleteTableFormDTO,
  type IDuplicateTableFormDTO,
  type IExportViewDTO,
  type IReadableRecordDTO,
  type IRecordQueryRepository,
  type IRecordRepository,
  type View,
} from "../modules"
import type { ICreateTableFormDTO } from "../modules/forms/dto/create-form.dto"
import type { TableDo } from "../table.do"
import { TableFactory } from "../table.factory"
import type { ITableRepository } from "../table.repository"
import { injectTableRepository } from "../table.repository.provider"
import { createTableFieldMethod } from "./methods/create-table-field.method"
import { createTableFormMethod } from "./methods/create-table-form.method"
import { createTableViewMethod } from "./methods/create-table-view.method"
import { createTableMethod } from "./methods/create-table.method"
import { deleteTableFieldMethod } from "./methods/delete-table-field.method"
import { deleteTableFormMethod } from "./methods/delete-table-form.method"
import { deleteTableMethod } from "./methods/delete-table.method"
import { duplicateBaseMethod } from "./methods/duplicate-base.method"
import { duplicateTableFieldMethod } from "./methods/duplicate-table-field.method"
import { duplicateTableFormMethod } from "./methods/duplicate-table-form.method"
import { duplicateTableMethod } from "./methods/duplicate-table.method"
import { duplicateTablesMethod } from "./methods/duplicate-tables.method"
import { exportViewMethod } from "./methods/export-view.method"
import { updateTableFieldMethod } from "./methods/update-table-field.method"
import { updateTableMethod } from "./methods/update-table.method"

export interface ITableService {
  createTable(dto: ICreateTableDTO): Promise<TableDo>
  updateTable(dto: IUpdateTableDTO): Promise<TableDo>
  deleteTable(dto: IDeleteTableDTO): Promise<TableDo>
  duplicateTable(dto: IDuplicateTableDTO): Promise<TableDo>

  createTableField(dto: ICreateTableFieldDTO): Promise<TableDo>
  updateTableField(dto: IUpdateTableFieldDTO): Promise<TableDo>
  deleteTableField(dto: IDeleteTableFieldDTO): Promise<TableDo>
  duplicateTableField(dto: IDuplicateTableFieldDTO): Promise<TableDo>

  createTableForm(dto: ICreateTableFormDTO): Promise<{ table: TableDo; form: FormVO }>
  deleteTableForm(dto: IDeleteTableFormDTO): Promise<TableDo>
  duplicateTableForm(dto: IDuplicateTableFormDTO): Promise<{ table: TableDo; form: FormVO }>

  createTableView(dto: ICreateTableViewDTO): Promise<{ table: TableDo; view: View }>

  exportView(tableId: string, dto: IExportViewDTO): Promise<{ table: TableDo; records: IReadableRecordDTO[] }>
  duplicateBase(base: Base, spaceId: ISpaceId, targetSpaceId: ISpaceId, dto: IDuplicateBaseDTO): Promise<Base>
  duplicateTables(spaceId: ISpaceId, targetSpaceId: ISpaceId, base: Base, tables: TableDo[]): Promise<TableDo[]>
}

@singleton()
export class TableService implements ITableService {
  readonly logger = createLogger(TableService.name)

  public get creator() {
    return new TableFactory()
  }

  constructor(
    @injectTableRepository()
    public readonly repository: ITableRepository,
    @injectRecordRepository()
    public readonly recordRepository: IRecordRepository,
    @injectRecordQueryRepository()
    public readonly recordQueryRepository: IRecordQueryRepository,
    @injectBaseRepository()
    public readonly baseRepository: IBaseRepository,
  ) {}

  createTable = createTableMethod
  updateTable = updateTableMethod
  deleteTable = deleteTableMethod
  duplicateTable = duplicateTableMethod

  createTableField = createTableFieldMethod
  deleteTableField = deleteTableFieldMethod
  duplicateTableField = duplicateTableFieldMethod
  updateTableField = updateTableFieldMethod

  createTableForm = createTableFormMethod
  deleteTableForm = deleteTableFormMethod
  duplicateTableForm = duplicateTableFormMethod

  createTableView = createTableViewMethod

  exportView = exportViewMethod

  duplicateBase = duplicateBaseMethod
  duplicateTables = duplicateTablesMethod
}
