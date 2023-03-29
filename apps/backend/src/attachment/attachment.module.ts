import { Module } from '@nestjs/common'
import { AttachmentController } from './attachment.controller.js'

@Module({
  controllers: [AttachmentController],
})
export class AttachmentModule {}
