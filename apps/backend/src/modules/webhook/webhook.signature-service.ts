import { singleton } from "@undb/di"
import { IWebhookSignService } from "@undb/webhook"
import { IWebhookMessageBody } from "@undb/webhook/src/webhook.message"

@singleton()
export class WebhookSignatureService implements IWebhookSignService {
  sign(body: IWebhookMessageBody): string {
    const hash = new Bun.CryptoHasher("sha256")
      .update(JSON.stringify(body.timestamp.toISOString() + "." + JSON.stringify(body)))
      .digest("hex")

    return "undb_" + hash
  }
}
