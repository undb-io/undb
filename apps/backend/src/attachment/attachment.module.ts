import { Module } from '@nestjs/common'
import { objectStorage } from './adapters/provider.js'
import { AttachmentController } from './attachment.controller.js'
import { AttachmentService } from './attachment.service.js'

@Module({
  controllers: [AttachmentController],
  providers: [AttachmentService, objectStorage],
})
export class AttachmentModule {}
