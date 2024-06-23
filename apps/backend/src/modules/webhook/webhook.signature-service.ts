import { singleton } from "@undb/di"
import { IWebhookMessageBody, IWebhookSignService } from "@undb/webhook"

@singleton()
export class WebhookSignatureService implements IWebhookSignService {
  sign(body: IWebhookMessageBody): string {
    const hash = new Bun.CryptoHasher("sha256")
      .update(JSON.stringify(body.timestamp.toISOString() + "." + JSON.stringify(body)))
      .digest("hex")

    return "undb_" + hash
  }
}
