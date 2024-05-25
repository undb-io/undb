import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetReadableRecordByIdQuery, type IGetRecordByIdQuery } from "@undb/queries"
import { injectRecordsQueryService, type IRecordsQueryService } from "@undb/table"

@queryHandler(GetReadableRecordByIdQuery)
@singleton()
export class GetReadableRecordByIdHandler implements IQueryHandler<IGetRecordByIdQuery, any> {
  constructor(
    @injectRecordsQueryService()
    private readonly svc: IRecordsQueryService,
  ) {}

  async execute(query: IGetRecordByIdQuery): Promise<any> {
    return (await this.svc.getReadableRecordById(query)).into(null)
  }
}
