import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetShareQuery, type IGetShareQuery } from "@undb/queries"
import { injectShareService, type IShareDTO, type IShareService } from "@undb/share"

@queryHandler(GetShareQuery)
@singleton()
export class GetShareQueryHandler implements IQueryHandler<any, IShareDTO> {
  constructor(
    @injectShareService()
    private readonly svc: IShareService,
  ) {}

  async execute(query: IGetShareQuery): Promise<IShareDTO> {
    return (await this.svc.getShare(query.shareId)).unwrap()
  }
}
