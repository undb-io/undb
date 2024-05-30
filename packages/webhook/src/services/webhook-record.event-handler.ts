import type { IEventHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { TableIdVo, injectTableRepository, type IRecordEvent, type ITableRepository } from "@undb/table"
import { injectWebhookHttpService, type IWebhookHttpService } from "./webhook.http-service"
import { injectWebhookRepository, type IWebhookRepository } from "../webhook.repository"
import { withTableEvents } from "../specifications/webhook-target.specification"
import { parallel } from "radash"
import { singleton } from "@undb/di"

@singleton()
export class WebhookEventsHandler implements IEventHandler<IRecordEvent> {
  private readonly logger = createLogger(WebhookEventsHandler.name)
  constructor(
    @injectWebhookHttpService()
    protected readonly httpService: IWebhookHttpService,
    @injectWebhookRepository()
    protected readonly repo: IWebhookRepository,
    @injectTableRepository()
    protected readonly tableRepo: ITableRepository,
  ) {}

  async handle(event: IRecordEvent): Promise<void> {
    try {
      const tableId = event.payload.tableId
      const table = (await this.tableRepo.findOneById(new TableIdVo(tableId))).expect("not found table")

      const spec = withTableEvents(tableId, [event.name])
      const webhooks = await this.repo.find(spec)

      await parallel(100, webhooks, async (webhook) => {
        const refinedEvent = webhook.refineEvent(table, event)
        if (refinedEvent.isNone()) {
          this.logger.info("skipping webhook sending")
          return
        }

        await this.httpService.send(webhook, refinedEvent.unwrap())
      })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
