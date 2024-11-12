import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetPivotDataQuery, type IGetPivotDataQuery } from "@undb/queries"
import { injectRecordsQueryService, type IRecordsQueryService } from "@undb/table"

@queryHandler(GetPivotDataQuery)
@singleton()
export class GetPivotDataQueryHandler implements IQueryHandler<IGetPivotDataQuery, any> {
  constructor(
    @injectRecordsQueryService()
    private readonly svc: IRecordsQueryService,
  ) {}

  async execute(query: IGetPivotDataQuery): Promise<any> {
    const data = await this.svc.getPivotData(query)

    return data
  }
}
