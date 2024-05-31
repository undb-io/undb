import { container } from "@undb/di"
import { WEBHOOK_HTTP_SERVICE, WEBHOOK_SIGN_SERVICE } from "@undb/webhook"
import { WebhookInMemoryHttpService } from "./webhook.in-memory.http.service"
import { WebhookSignatureService } from "./webhook.signature-service"

export const registerWebhook = () => {
  container.register(WEBHOOK_HTTP_SERVICE, WebhookInMemoryHttpService)
  container.register(WEBHOOK_SIGN_SERVICE, WebhookSignatureService)
}
