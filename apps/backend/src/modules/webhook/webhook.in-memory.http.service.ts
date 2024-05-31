import { singleton } from "@undb/di"
import { IWebhookHttpService, WebhookDo } from "@undb/webhook"
import { IWebhookMessage } from "@undb/webhook/src/webhook.message"
import got from "got"

@singleton()
export class WebhookInMemoryHttpService implements IWebhookHttpService {
  async send(webhook: WebhookDo, mesasge: IWebhookMessage): Promise<void> {
    await got(webhook.url.unpack(), {
      method: webhook.method.unpack(),
      json: mesasge.body,
      headers: mesasge.headers,
    })
  }
}
