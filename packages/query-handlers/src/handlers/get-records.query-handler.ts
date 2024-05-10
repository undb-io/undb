import { queryHandler } from '@undb/cqrs'
import { singleton } from '@undb/di'
import type { IQueryHandler } from '@undb/domain'
import { createLogger } from '@undb/logger'
import { GetRecordsQuery, type IGetRecordsQuery } from '@undb/queries'
import { injectRecordsQueryService, type IRecordsDTO, type IRecordsQueryService } from '@undb/table'

@queryHandler(GetRecordsQuery)
@singleton()
export class GetRecordsQueryHandler implements IQueryHandler<IGetRecordsQuery, any> {
  private readonly logger = createLogger(GetRecordsQueryHandler.name)

  constructor(
    @injectRecordsQueryService()
    private readonly svc: IRecordsQueryService
  ) {}

  async execute(query: IGetRecordsQuery): Promise<IRecordsDTO> {
    this.logger.debug(query, 'get records query executed')

    return this.svc.getRecords(query)
  }
}
