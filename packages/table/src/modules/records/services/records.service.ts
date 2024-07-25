import { singleton } from "@undb/di"
import type { IUniqueTableDTO } from "../../../dto"
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
  type IUpdateRecordDTO,
  type RecordDO,
} from "../record"
import { bulkdeleteRecordsMethod } from "./methods/bulk-delete-records.method"
import { bulkduplicateRecordsMethod } from "./methods/bulk-duplicate-records.method"
import { bulkUpdateRecordsMethod } from "./methods/bulk-update-records.method"
import { createRecordMethod } from "./methods/create-record.method"
import { createRecordsMethod } from "./methods/create-records.method"
import { deleteRecordMethod } from "./methods/delete-record.method"
import { duplicateRecordMethod } from "./methods/duplicate-record.method"
import { updateRecordMethod } from "./methods/update-record.method"

export interface IRecordsService {
  createRecord(table: IUniqueTableDTO, dto: ICreateRecordDTO): Promise<RecordDO>
  createRecords(table: IUniqueTableDTO, dto: ICreateRecordDTO[]): Promise<RecordDO[]>
  updateRecord(table: IUniqueTableDTO, dto: IUpdateRecordDTO): Promise<RecordDO>
  bulkUpdateRecords(table: IUniqueTableDTO, dto: IBulkUpdateRecordsDTO): Promise<RecordDO[]>
  deleteRecord(table: IUniqueTableDTO, dto: IDeleteRecordDTO): Promise<RecordDO>
  bulkDeleteRecords(table: IUniqueTableDTO, dto: IBulkDeleteRecordsDTO): Promise<RecordDO[]>
  duplicateRecord(table: IUniqueTableDTO, dto: IDuplicateRecordDTO): Promise<RecordDO>
  bulkDuplicateRecords(table: IUniqueTableDTO, dto: IBulkDuplicateRecordsDTO): Promise<RecordDO[]>
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
  bulkUpdateRecords = bulkUpdateRecordsMethod
  deleteRecord = deleteRecordMethod
  bulkDeleteRecords = bulkdeleteRecordsMethod
  duplicateRecord = duplicateRecordMethod
  bulkDuplicateRecords = bulkduplicateRecordsMethod
}
