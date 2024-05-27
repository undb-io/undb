import { singleton } from "@undb/di"
import type { ITableRepository } from "../../../table.repository"
import { injectTableRepository } from "../../../table.repository.provider"
import {
  injectRecordRepository,
  type ICreateRecordDTO,
  type IRecordRepository,
  type IUpdateRecordDTO,
  type RecordDO,
} from "../record"
import { createRecordMethod } from "./methods/create-record.method"
import { updateRecordMethod } from "./methods/update-record.method"
import { deleteRecordMethod } from "./methods/delete-record.method"

export interface IRecordsService {
  createRecord(tableId: string, dto: ICreateRecordDTO): Promise<RecordDO>
  updateRecord(tableId: string, dto: IUpdateRecordDTO): Promise<RecordDO>
  deleteRecord(tableId: string, dto: IDeleteRecordDTO): Promise<RecordDO>
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
  updateRecord = updateRecordMethod
  deleteRecord = deleteRecordMethod
}
