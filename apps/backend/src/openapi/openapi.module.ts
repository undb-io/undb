import { Module } from '@nestjs/common'
import { TableModule } from '../modules/table/table.module.js'
import { OpenAPIController } from './openapi.controller.js'
import { OpenAPIService } from './openapi.service.js'

@Module({
  imports: [TableModule],
  controllers: [OpenAPIController],
  providers: [OpenAPIService],
})
export class OpenAPIModule {}
