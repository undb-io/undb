import { NanoID } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { z } from 'zod'

export class WebhookId extends NanoID {
  public static WEBHOOK_ID_PREFIX = 'whk'
  private static WEBHOOK_ID_SIZE = 8

  static create(): WebhookId {
    const id = NanoID.createId(WebhookId.WEBHOOK_ID_PREFIX, WebhookId.WEBHOOK_ID_SIZE)
    return new WebhookId(id)
  }

  static createId(): string {
    return this.create().value
  }

  static from(id: string): Result<WebhookId, string> {
    return Ok(new WebhookId(id))
  }

  static fromOrCreate(id?: string): WebhookId {
    if (!id) {
      return WebhookId.create()
    }
    return WebhookId.from(id).unwrap()
  }
}

export const webhookIdSchema = z.string().startsWith(WebhookId.WEBHOOK_ID_PREFIX)
