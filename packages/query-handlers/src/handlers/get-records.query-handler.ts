import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetRecordsQuery, type IGetRecordsQuery } from "@undb/queries"
import { injectRecordsQueryService, type IRecordsDTO, type IRecordsQueryService } from "@undb/table"

@queryHandler(GetRecordsQuery)
@singleton()
export class GetRecordsQueryHandler implements IQueryHandler<IGetRecordsQuery, any> {
  constructor(
    @injectRecordsQueryService()
    private readonly svc: IRecordsQueryService,
  ) {}

  async execute(query: IGetRecordsQuery): Promise<IRecordsDTO> {
    return this.svc.getRecords(query)
  }
}
