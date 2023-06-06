import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TableModule } from '../modules/table/table.module.js'
import { OpenAPIDocController } from './openapi-doc.controller.js'
import { OpenAPIDocService } from './openapi-doc.service.js'
import { OpenAPIController } from './openapi.controller.js'

@Module({
  imports: [TableModule, CqrsModule],
  controllers: [OpenAPIDocController, OpenAPIController],
  providers: [OpenAPIDocService],
})
export class OpenAPIModule {}
