import { singleton } from "@undb/di"
import type { ITableRepository } from "../../../table.repository"
import { injectTableRepository } from "../../../table.repository.provider"
import {
  injectRecordRepository,
  type IBulkDeleteRecordsDTO,
  type IBulkDuplicateRecordsDTO,
  type ICreateRecordDTO,
  type IDeleteRecordDTO,
  type IDuplicateRecordDTO,
  type IRecordRepository,
  type IUpdateRecordDTO,
  type RecordDO,
} from "../record"
import { bulkdeleteRecordsMethod } from "./methods/bulk-delete-records.method"
import { bulkduplicateRecordsMethod } from "./methods/bulk-duplicate-records.method"
import { createRecordMethod } from "./methods/create-record.method"
import { createRecordsMethod } from "./methods/create-records.method"
import { deleteRecordMethod } from "./methods/delete-record.method"
import { duplicateRecordMethod } from "./methods/duplicate-record.method"
import { updateRecordMethod } from "./methods/update-record.method"

export interface IRecordsService {
  createRecord(tableId: string, dto: ICreateRecordDTO): Promise<RecordDO>
  createRecords(tableId: string, dto: ICreateRecordDTO[]): Promise<RecordDO[]>
  updateRecord(tableId: string, dto: IUpdateRecordDTO): Promise<RecordDO>
  deleteRecord(tableId: string, dto: IDeleteRecordDTO): Promise<RecordDO>
  bulkDeleteRecords(tableId: string, dto: IBulkDeleteRecordsDTO): Promise<RecordDO[]>
  duplicateRecord(tableId: string, dto: IDuplicateRecordDTO): Promise<RecordDO>
  bulkDuplicateRecords(tableId: string, dto: IBulkDuplicateRecordsDTO): Promise<RecordDO[]>
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
  createRecords = createRecordsMethod
  updateRecord = updateRecordMethod
  deleteRecord = deleteRecordMethod
  bulkDeleteRecords = bulkdeleteRecordsMethod
  duplicateRecord = duplicateRecordMethod
  bulkDuplicateRecords = bulkduplicateRecordsMethod
}
