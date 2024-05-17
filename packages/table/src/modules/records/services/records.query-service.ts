import { singleton } from "@undb/di"
import type { PaginatedDTO } from "@undb/domain"
import type { ITableRepository } from "../../../table.repository"
import { injectTableRepository } from "../../../table.repository.provider"
import type { IGetRecordsDTO } from "../dto"
import { injectRecordQueryRepository, type IRecordDTO, type IRecordQueryRepository } from "../record"
import { getRecords } from "./methods/get-records.method"

export interface IRecordsQueryService {
  getRecords(query: IGetRecordsDTO): Promise<PaginatedDTO<IRecordDTO>>
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
}
