import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { CountRecordsQuery, type ICountRecordsOutput, type ICountRecordsQuery } from "@undb/queries"
import { injectRecordsQueryService, type IRecordsQueryService } from "@undb/table"

@queryHandler(CountRecordsQuery)
@singleton()
export class CountRecordsQueryHandler implements IQueryHandler<ICountRecordsQuery, ICountRecordsOutput> {
  constructor(
    @injectRecordsQueryService()
    private readonly svc: IRecordsQueryService,
  ) {}

  async execute(query: ICountRecordsQuery): Promise<ICountRecordsOutput> {
    const count = await this.svc.countRecords(query)

    return {
      count: count,
    }
  }
}
