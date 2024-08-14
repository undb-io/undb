import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetShareRecordsQuery, type IGetShareRecordsOutput, type IGetShareRecordsQuery } from "@undb/queries"
import { injectShareService, type IShareService } from "@undb/share"

@queryHandler(GetShareRecordsQuery)
@singleton()
export class GetShareRecordsQueryHandler implements IQueryHandler<IGetShareRecordsQuery, IGetShareRecordsOutput> {
  constructor(
    @injectShareService()
    private readonly svc: IShareService,
  ) {}

  async execute(query: IGetShareRecordsQuery): Promise<IGetShareRecordsOutput> {
    const records = await this.svc.getShareRecords(query.shareId)

    return {
      total: records.total,
      records: records.values,
    }
  }
}
