import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetRecordByIdQuery, type IGetRecordByIdOutput, type IGetRecordByIdQuery } from "@undb/queries"
import { injectRecordsQueryService, type IRecordsQueryService } from "@undb/table"

@queryHandler(GetRecordByIdQuery)
@singleton()
export class GetRecordByIdQueryHandler implements IQueryHandler<IGetRecordByIdQuery, IGetRecordByIdOutput> {
  constructor(
    @injectRecordsQueryService()
    private readonly svc: IRecordsQueryService,
  ) {}

  async execute(query: IGetRecordByIdQuery): Promise<IGetRecordByIdOutput> {
    const record = (await this.svc.getRecordById(query)).expect("Record not found")

    return {
      record,
    }
  }
}
