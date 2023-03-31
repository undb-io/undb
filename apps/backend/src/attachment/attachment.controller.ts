import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { plainToClass } from 'class-transformer'
import { AttachmentService } from './attachment.service.js'
import { AttachmentResponseDto } from './dtos/attachment.response.dto.js'

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File): Promise<AttachmentResponseDto> {
    const { token, id } = await this.attachmentService.uploadFile(file.buffer, file.originalname)

    return plainToClass(AttachmentResponseDto, {
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      id,
      token,
    })
  }
}
