import { singleton } from "@undb/di"
import type { Option, PaginatedDTO } from "@undb/domain"
import type { ITableRepository } from "../../../table.repository"
import { injectTableRepository } from "../../../table.repository.provider"
import type { IGetRecordByIdDTO, IGetRecordsDTO } from "../dto"
import { injectRecordQueryRepository, type IRecordDTO, type IRecordQueryRepository } from "../record"
import { getRecordById } from "./methods/get-record-by-id.method"
import { getRecords } from "./methods/get-records.method"

export interface IRecordsQueryService {
  getRecords(query: IGetRecordsDTO): Promise<PaginatedDTO<IRecordDTO>>
  getRecordById(query: IGetRecordByIdDTO): Promise<Option<IRecordDTO>>
}

@singleton()
export class RecordsQueryService implements IRecordsQueryService {
  constructor(
    @injectTableRepository()
    readonly tableRepository: ITableRepository,
    @injectRecordQueryRepository()
    readonly repo: IRecordQueryRepository,
  ) {}

  getRecords = getRecords
  getRecordById = getRecordById
}
