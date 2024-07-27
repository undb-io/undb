import { singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import { IWebhookHttpService, WebhookDo } from "@undb/webhook"
import { IWebhookMessage } from "@undb/webhook/src/webhook.message"
import got from "got"

@singleton()
export class WebhookInMemoryHttpService implements IWebhookHttpService {
  logger = createLogger(WebhookInMemoryHttpService.name)
  async send(webhook: WebhookDo, mesasge: IWebhookMessage): Promise<void> {
    this.logger.debug({ webhook, mesasge }, "Sending webhook")
    await got(webhook.url.unpack(), {
      method: webhook.method.unpack(),
      json: mesasge.body,
      headers: mesasge.headers,
      retry: {
        limit: 10,
        backoffLimit: 1000,
      },
    })
  }
}
