import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { None, Some, type IQueryHandler } from "@undb/domain"
import { GetWebhooksQuery, type IGetWebhooksOutput, type IGetWebhooksQuery } from "@undb/queries"
import { TableIdVo } from "@undb/table"
import { WithWebhookTableId, injectWebhookQueryRepository, type IWebhookQueryRepository } from "@undb/webhook"

@queryHandler(GetWebhooksQuery)
@singleton()
export class GetWebhooksQueryHandler implements IQueryHandler<IGetWebhooksQuery, IGetWebhooksOutput> {
  constructor(
    @injectWebhookQueryRepository()
    private readonly repo: IWebhookQueryRepository,
  ) {}

  async execute(query: IGetWebhooksQuery): Promise<IGetWebhooksOutput> {
    const spec = new WithWebhookTableId(new TableIdVo(query.tableId))
    const webhooks = await this.repo.find(Some(spec), None)

    return {
      webhooks,
    }
  }
}
