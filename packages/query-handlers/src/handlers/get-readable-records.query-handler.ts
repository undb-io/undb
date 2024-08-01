import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetReadableRecordsQuery, type IGetRecordsQuery } from "@undb/queries"
import { injectRecordsQueryService, type IRecordsQueryService } from "@undb/table"

@queryHandler(GetReadableRecordsQuery)
@singleton()
export class GetReadableRecordsHandler implements IQueryHandler<IGetRecordsQuery, any> {
  constructor(
    @injectRecordsQueryService()
    private readonly svc: IRecordsQueryService,
  ) {}

  async execute(query: IGetRecordsQuery): Promise<any> {
    return this.svc.getReadableRecords(query)
  }
}
