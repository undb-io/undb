import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetRecordsQuery, type IGetRecordsOutput, type IGetRecordsQuery } from "@undb/queries"
import { injectRecordsQueryService, type IRecordsQueryService } from "@undb/table"

@queryHandler(GetRecordsQuery)
@singleton()
export class GetRecordsQueryHandler implements IQueryHandler<IGetRecordsQuery, IGetRecordsOutput> {
  constructor(
    @injectRecordsQueryService()
    private readonly svc: IRecordsQueryService,
  ) {}

  async execute(query: IGetRecordsQuery): Promise<IGetRecordsOutput> {
    const records = await this.svc.getRecords(query)

    return {
      total: records.total,
      records: records.values,
    }
  }
}
