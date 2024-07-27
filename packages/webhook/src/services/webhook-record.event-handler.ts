import { singleton } from "@undb/di"
import type { IEventHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { TableIdVo, injectTableRepository, type IRecordEvent, type ITableRepository } from "@undb/table"
import { parallel } from "radash"
import { withTableEvents } from "../specifications/webhook-tableId.specification"
import { injectWebhookRepository, type IWebhookRepository } from "../webhook.repository"
import { injectWebhookSignService, type IWebhookSignService } from "./webhook-sign.service"
import { injectWebhookHttpService, type IWebhookHttpService } from "./webhook.http-service"

@singleton()
export class WebhookEventsHandler implements IEventHandler<IRecordEvent> {
  private readonly logger = createLogger(WebhookEventsHandler.name)
  constructor(
    @injectWebhookHttpService()
    private readonly httpService: IWebhookHttpService,
    @injectWebhookSignService()
    private readonly signService: IWebhookSignService,
    @injectWebhookRepository()
    private readonly repo: IWebhookRepository,
    @injectTableRepository()
    private readonly tableRepo: ITableRepository,
  ) {}

  async handle(event: IRecordEvent): Promise<void> {
    try {
      const tableId = event.payload.tableId
      const table = (await this.tableRepo.findOneById(new TableIdVo(tableId))).expect("not found table")

      const spec = withTableEvents(tableId, [event.name])
      const webhooks = await this.repo.find(spec)

      if (webhooks.length) {
        this.logger.debug({ tableId, webhooks, event }, "found webhooks")
      }

      await parallel(100, webhooks, async (webhook) => {
        const refinedEvent = webhook.refineEvent(table, event)
        if (refinedEvent.isNone()) {
          this.logger.debug("skipping webhook sending")
          return
        }

        const evt = refinedEvent.unwrap()
        const body = webhook.constructBody(evt)
        const signature = this.signService.sign(body)
        const message = webhook.constructMessage(signature, body)

        this.logger.debug({ message }, "sending webhook message")
        await this.httpService.send(webhook, message)
      })
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }
}
