import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TableAdapterModule } from '../core/table/adapters/table-adapter.module.js'
import { RealtimeModule } from '../realtime/realtime.module.js'
import { ApiTokenModule } from './api-token/api-token.module.js'
import { convertors } from './convertor/index.js'
import { OpenAPIDocController } from './openapi-doc.controller.js'
import { OpenAPIDocService } from './openapi-doc.service.js'
import { OpenAPIRecordController } from './openapi-record.controller.js'
import { OpenAPIRecordService } from './openapi-record.service.js'
import { OpenAPITableController } from './openapi-table.controller.js'
import { OpenAPIWebhookController } from './openapi-webhook.controller.js'
import { OpenAPIWebhookService } from './openapi-webhook.service.js'

@Module({
  imports: [TableAdapterModule, RealtimeModule, CqrsModule, ApiTokenModule],
  controllers: [OpenAPIDocController, OpenAPITableController, OpenAPIRecordController, OpenAPIWebhookController],
  providers: [OpenAPIDocService, OpenAPIRecordService, OpenAPIWebhookService, ...convertors],
})
export class OpenAPIModule {}
