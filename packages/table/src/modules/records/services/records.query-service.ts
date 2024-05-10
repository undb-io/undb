import { singleton } from '@undb/di'
import type { ITableRepository } from '../../../table.repository'
import { injectTableRepository } from '../../../table.repository.provider'
import type { IGetRecordsDTO, IRecordsDTO } from '../dto'
import { injectRecordQueryRepository, type IRecordQueryRepository } from '../record'
import { getRecords } from './methods/get-records.method'

export interface IRecordsQueryService {
  getRecords(query: IGetRecordsDTO): Promise<IRecordsDTO>
}

@singleton()
export class RecordsQueryService implements IRecordsQueryService {
  constructor(
    @injectTableRepository()
    readonly tableRepository: ITableRepository,
    @injectRecordQueryRepository()
    readonly repo: IRecordQueryRepository
  ) {}

  getRecords = getRecords
}
