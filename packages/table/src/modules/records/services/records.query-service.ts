import { singleton } from "@undb/di"
import type { Option, PaginatedDTO } from "@undb/domain"
import type { ITableRepository } from "../../../table.repository"
import { injectTableRepository } from "../../../table.repository.provider"
import type { AggregateResult, ICountRecordsDTO, IGetAggregatesDTO, IGetRecordByIdDTO, IGetRecordsDTO } from "../dto"
import {
  injectRecordQueryRepository,
  type IRecordDTO,
  type IRecordQueryRepository,
  type IRecordReadableValueDTO,
} from "../record"
import { countRecords } from "./methods/count-records.method"
import { getAggregates } from "./methods/get-aggregates.method"
import { getReadableRecordById } from "./methods/get-readable-record-by-id.method"
import { getReadableRecords } from "./methods/get-readable-records.method"
import { getRecordById } from "./methods/get-record-by-id.method"
import { getRecords } from "./methods/get-records.method"

export interface IRecordsQueryService {
  getRecords(query: IGetRecordsDTO): Promise<PaginatedDTO<IRecordDTO>>
  countRecords(query: ICountRecordsDTO): Promise<number>
  getRecordById(query: IGetRecordByIdDTO): Promise<Option<IRecordDTO>>
  getReadableRecords(query: IGetRecordsDTO): Promise<PaginatedDTO<IRecordReadableValueDTO>>
  getReadableRecordById(query: IGetRecordByIdDTO): Promise<Option<IRecordReadableValueDTO>>
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
  countRecords = countRecords
  getRecordById = getRecordById
  getReadableRecords = getReadableRecords
  getReadableRecordById = getReadableRecordById
  getAggregates = getAggregates
}
