import { singleton } from "@undb/di"
import type { Option } from "@undb/domain"
import type { IUniqueTableDTO } from "../../../dto"
import type { TableDo } from "../../../table.do"
import type { ITableRepository } from "../../../table.repository"
import { injectTableRepository } from "../../../table.repository.provider"
import {
  injectRecordRepository,
  type IBulkDeleteRecordsDTO,
  type IBulkDuplicateRecordsDTO,
  type IBulkUpdateRecordsDTO,
  type ICreateRecordDTO,
  type IDeleteRecordDTO,
  type IDuplicateRecordDTO,
  type IRecordRepository,
  type ISubmitFormDTO,
  type IUpdateRecordDTO,
  type RecordDO,
} from "../record"
import type { ITriggerRecordButtonDTO } from "../record/dto/trigger-record-button.dto"
import { bulkdeleteRecordsMethod } from "./methods/bulk-delete-records.method"
import { bulkduplicateRecordsMethod } from "./methods/bulk-duplicate-records.method"
import { bulkUpdateRecordsMethod } from "./methods/bulk-update-records.method"
import { createRecordMethod } from "./methods/create-record.method"
import { createRecordsMethod } from "./methods/create-records.method"
import { createTablesRecordsMethod } from "./methods/create-tables-records.method"
import { deleteRecordMethod } from "./methods/delete-record.method"
import { duplicateRecordMethod } from "./methods/duplicate-record.method"
import { submitFormMethod } from "./methods/submit-form.method"
import { triggerRecordButtonMethod } from "./methods/trigger-record-button.method"
import { updateRecordMethod } from "./methods/update-record.method"

export interface IRecordsService {
  createRecord(table: IUniqueTableDTO, dto: ICreateRecordDTO): Promise<RecordDO>
  submitForm(table: IUniqueTableDTO, dto: ISubmitFormDTO): Promise<RecordDO>
  createRecords(table: IUniqueTableDTO, dto: ICreateRecordDTO[]): Promise<RecordDO[]>
  updateRecord(table: IUniqueTableDTO, dto: IUpdateRecordDTO): Promise<RecordDO>
  triggerRecordButton(table: IUniqueTableDTO, dto: ITriggerRecordButtonDTO): Promise<Option<RecordDO>>
  bulkUpdateRecords(table: IUniqueTableDTO, dto: IBulkUpdateRecordsDTO): Promise<RecordDO[]>
  deleteRecord(table: IUniqueTableDTO, dto: IDeleteRecordDTO): Promise<RecordDO>
  bulkDeleteRecords(table: IUniqueTableDTO, dto: IBulkDeleteRecordsDTO): Promise<RecordDO[]>
  duplicateRecord(table: IUniqueTableDTO, dto: IDuplicateRecordDTO): Promise<RecordDO>
  bulkDuplicateRecords(table: IUniqueTableDTO, dto: IBulkDuplicateRecordsDTO): Promise<RecordDO[]>
  createTablesRecords(input: { table: TableDo; records: RecordDO[] }[]): Promise<void>
}

@singleton()
export class RecordsService implements IRecordsService {
  constructor(
    @injectTableRepository()
    readonly tableRepository: ITableRepository,
    @injectRecordRepository()
    readonly repo: IRecordRepository,
  ) {}

  createRecord = createRecordMethod
  submitForm = submitFormMethod
  createRecords = createRecordsMethod
  updateRecord = updateRecordMethod
  triggerRecordButton = triggerRecordButtonMethod
  bulkUpdateRecords = bulkUpdateRecordsMethod
  deleteRecord = deleteRecordMethod
  bulkDeleteRecords = bulkdeleteRecordsMethod
  duplicateRecord = duplicateRecordMethod
  bulkDuplicateRecords = bulkduplicateRecordsMethod
  createTablesRecords = createTablesRecordsMethod
}
