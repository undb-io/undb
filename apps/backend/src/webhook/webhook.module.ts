import type { DynamicModule } from '@nestjs/common'
import { ConfigurableModuleBuilder, Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TableAdapterModule } from '../core/table/adapters/table-adapter.module.js'
import { adapters } from './adapters/index.js'
import { commands } from './commands/index.js'
import { events } from './events/index.js'
import { WEBHOOK_HTTP_SERVICE } from './providers.js'
import { queries } from './queries/index.js'
import { TemporalWebhookHttpService } from './temporal/temporal-webhook-http.service.js'
import { TemporalModule } from './temporal/temporal.module.js'
import { WebhookSignatureService } from './webhook-signature.service.js'
import { WebhooHttpMemoryService } from './webhook.http-memory-service.js'

export const { ConfigurableModuleClass: WebhookConfigurableModuleClass, OPTIONS_TYPE } =
  new ConfigurableModuleBuilder().build()

@Module({})
export class WebhookModule extends WebhookConfigurableModuleClass {
  static register(options: typeof OPTIONS_TYPE): DynamicModule {
    const imports: DynamicModule['imports'] = [CqrsModule, TableAdapterModule]
    const providers: DynamicModule['providers'] = [
      WebhookSignatureService,
      ...events,
      ...adapters,
      ...commands,
      ...queries,
    ]

    const provider = process.env.UNDB_WEBHOOK_PUBLISH_PROVIDER
    if (provider === 'temporal') {
      imports.push(TemporalModule)
      providers.push({ provide: WEBHOOK_HTTP_SERVICE, useClass: TemporalWebhookHttpService })
    } else {
      providers.push({ provide: WEBHOOK_HTTP_SERVICE, useClass: WebhooHttpMemoryService })
    }

    return {
      ...super.register(options),
      imports,
      providers,
    }
  }
}
