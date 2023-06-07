import { Controller, Get, Param, Query, Res, StreamableFile, UseGuards } from '@nestjs/common'
import { type Response } from 'express'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { OpenAPIDocService } from './openapi-doc.service.js'

@Controller('openapi')
export class OpenAPIDocController {
  constructor(private readonly openAPIService: OpenAPIDocService) {}

  @Get('docs/tables/:tableId')
  @UseGuards(JwtAuthGuard)
  public async doc(@Res() res: Response, @Param('tableId') tableId: string) {
    const html = await this.openAPIService.generateDoc(tableId)

    res.type('html')
    res.send(html)
  }

  @Get('docs/tables/:tableId/export')
  public async export(
    @Res({ passthrough: true }) res: Response,
    @Param('tableId') tableId: string,
    @Query('type') type?: string,
  ) {
    const { name, buffer } = await this.openAPIService.export(tableId, type)

    res.set({
      'Content-Disposition': `attachment; filename=${name}`,
    })

    return new StreamableFile(buffer)
  }
}
