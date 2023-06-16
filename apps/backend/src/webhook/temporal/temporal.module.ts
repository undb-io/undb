import { Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { Client } from '@temporalio/client'
import { Worker } from '@temporalio/worker'
import { WebhookSignatureService } from '../webhook-signature.service.js'
import { InjectTemporalClient, temporalClient } from './temporal.client.js'
import { InjectTemporalWorker, temporalWorker } from './temporal.worker.js'
import { workflows } from './workflows/index.js'

@Module({
  providers: [temporalClient, temporalWorker, ...workflows, WebhookSignatureService],
  exports: [temporalClient, ...workflows],
})
export class TemporalModule implements OnModuleInit, OnModuleDestroy {
  constructor(
    @InjectTemporalClient() private readonly client: Client,
    @InjectTemporalWorker() private readonly worker: Worker,
  ) {}

  async onModuleInit() {
    this.worker.run()
  }

  async onModuleDestroy() {
    this.worker.shutdown()
    await this.client.connection.close()
  }
}
