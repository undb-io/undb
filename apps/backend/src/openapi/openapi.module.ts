import { Module } from '@nestjs/common'
import { OpenAPIController } from './openapi.controller.js'

@Module({
  controllers: [OpenAPIController],
})
export class OpenAPIModule {}
