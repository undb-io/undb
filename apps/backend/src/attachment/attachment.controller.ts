import { type MemoryStorageFile } from '@blazity/nest-file-fastify'
import { Controller, Post, UploadedFile } from '@nestjs/common'

@Controller('attachment')
export class AttachmentController {
  @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: MemoryStorageFile) {
    console.log(file)
  }
}
