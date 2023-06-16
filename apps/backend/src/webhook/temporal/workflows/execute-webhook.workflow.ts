import { Injectable } from '@nestjs/common'
import type { Client } from '@temporalio/client'
import { IEvent } from '@undb/domain'
import { IWebhookHttpService, Webhook } from '@undb/integrations'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { WebhookSignatureService } from '../../webhook-signature.service.js'
import { InjectTemporalClient } from '../temporal.client.js'
import { executeWebhookWorkflow } from './workflows.js'

@Injectable()
export class ExecuteWebhookWorkflow implements IWebhookHttpService {
  constructor(
    @InjectPinoLogger() private readonly logger: PinoLogger,
    @InjectTemporalClient() private readonly client: Client,
    private readonly signatureService: WebhookSignatureService,
  ) {}

  async send(webhooks: Webhook[], event: IEvent) {
    try {
      for (const webhook of webhooks) {
        const signature = this.signatureService.sign(webhook, event)

        const headers = webhook.mergedHeaders(signature)
        const url = webhook.url.unpack()
        const body = webhook.constructEvent(event)
        const method = webhook.method.unpack()

        await this.client.workflow.start(executeWebhookWorkflow, {
          args: [{ headers, url, body, method }],
          taskQueue: 'undb_webhook',
          workflowId: webhook.id.value + '_' + event.id,
        })
      }
    } catch (error) {
      this.logger.error(error)
    }
  }
}
