import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { plainToClass } from 'class-transformer'
import { type Response } from 'express'
import { AttachmentService } from './attachment.service.js'
import { AttachmentResponseDto } from './dtos/attachment.response.dto.js'

@Controller('attachment')
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @Get(':name')
  async get(@Param('name') name: string, @Res() res: Response) {
    const { data, metaData } = await this.attachmentService.get(name)
    const contentType = metaData['content-type']
    res.set('Content-Type', contentType)
    return data.pipe(res)
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter(req, file, callback) {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8')
        callback(null, true)
      },
    }),
  )
  async upload(@UploadedFile() file: any): Promise<AttachmentResponseDto> {
    const { url, token, id } = await this.attachmentService.uploadFile(file.buffer, file.originalname, file.mimetype)

    return plainToClass(AttachmentResponseDto, {
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      id,
      token,
      url,
    })
  }
}
