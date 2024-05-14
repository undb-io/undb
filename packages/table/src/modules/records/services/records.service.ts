import { singleton } from "@undb/di"
import type { ITableRepository } from "../../../table.repository"
import { injectTableRepository } from "../../../table.repository.provider"
import { injectRecordRepository, type ICreateRecordDTO, type IRecordRepository, type RecordDO } from "../record"
import { createRecordMethod } from "./methods/create-record.method"

export interface IRecordsService {
  createRecord(tableId: string, dto: ICreateRecordDTO): Promise<RecordDO>
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
}
