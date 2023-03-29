import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileFastifyInterceptor } from 'fastify-file-interceptor'

@Controller('attachment')
export class AttachmentController {
  @Post('upload')
  @UseInterceptors(FileFastifyInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    console.log(file)
  }
}
