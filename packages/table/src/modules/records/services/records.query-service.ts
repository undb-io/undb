import { singleton } from "@undb/di"
import type { Option, PaginatedDTO } from "@undb/domain"
import type { ITableRepository } from "../../../table.repository"
import { injectTableRepository } from "../../../table.repository.provider"
import type { AggregateResult, IGetAggregatesDTO, IGetRecordByIdDTO, IGetRecordsDTO } from "../dto"
import {
  injectRecordQueryRepository,
  type IRecordDTO,
  type IRecordQueryRepository,
  type IRecordReadableDTO,
} from "../record"
import { getAggregates } from "./methods/get-aggregates.method"
import { getReadableRecordById } from "./methods/get-readable-record-by-id.method"
import { getReadableRecords } from "./methods/get-readable-records.method"
import { getRecordById } from "./methods/get-record-by-id.method"
import { getRecords } from "./methods/get-records.method"

export interface IRecordsQueryService {
  getRecords(query: IGetRecordsDTO): Promise<PaginatedDTO<IRecordDTO>>
  getRecordById(query: IGetRecordByIdDTO): Promise<Option<IRecordDTO>>
  getReadableRecords(query: IGetRecordsDTO): Promise<PaginatedDTO<IRecordReadableDTO>>
  getReadableRecordById(query: IGetRecordByIdDTO): Promise<Option<IRecordReadableDTO>>
  getAggregates(query: IGetAggregatesDTO): Promise<Record<string, AggregateResult>>
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
  getReadableRecords = getReadableRecords
  getReadableRecordById = getReadableRecordById
  getAggregates = getAggregates
}
