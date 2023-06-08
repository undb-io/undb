import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TableModule } from '../modules/table/table.module.js'
import { convertors } from './convertor/index.js'
import { OpenAPIDocController } from './openapi-doc.controller.js'
import { OpenAPIDocService } from './openapi-doc.service.js'
import { OpenAPIController } from './openapi.controller.js'
import { provider as mapper } from './openapi.mapper.js'
import { OpenAPIService } from './openapi.service.js'

@Module({
  imports: [TableModule, CqrsModule],
  controllers: [OpenAPIDocController, OpenAPIController],
  providers: [OpenAPIDocService, OpenAPIService, mapper, ...convertors],
})
export class OpenAPIModule {}
