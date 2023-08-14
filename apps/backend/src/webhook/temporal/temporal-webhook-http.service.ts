import { Injectable } from '@nestjs/common'
import { Client } from '@temporalio/client'
import type { RecordEvents } from '@undb/core'
import type { Webhook } from '@undb/integrations'
import { type IWebhookHttpService } from '@undb/integrations'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { WebhookSignatureService } from '../webhook-signature.service.js'
import { InjectTemporalClient } from './temporal.client.js'
import { executeWebhookWorkflow } from './workflows/workflows.js'

@Injectable()
export class TemporalWebhookHttpService implements IWebhookHttpService {
  constructor(
    @InjectPinoLogger() private readonly logger: PinoLogger,
    @InjectTemporalClient() private readonly client: Client,
    private readonly signatureService: WebhookSignatureService,
  ) {}

  async send(webhook: Webhook, event: RecordEvents) {
    try {
      const signature = this.signatureService.sign(webhook, event)

      const headers = webhook.mergedHeaders(signature)
      const url = webhook.url.unpack()
      const body = webhook.constructEvent(event)
      const method = webhook.method.unpack()

      const workflowId = webhook.id.value + '_' + event.id
      await this.client.workflow.start(executeWebhookWorkflow, {
        args: [{ headers, url, body, method }],
        taskQueue: 'undb_webhook',
        workflowId,
      })

      this.logger.info('temporal webhook http workflow executed %s', workflowId)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
