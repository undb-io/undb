import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileFastifyInterceptor } from 'fastify-file-interceptor'
import { AttachmentService } from './attachment.service.js'

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post('upload')
  @UseInterceptors(FileFastifyInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    await this.attachmentService.uploadFile(file.buffer, file.originalname)
  }
}
