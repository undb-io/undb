import { Controller, Get, Headers, Param, Query, Res, StreamableFile, UseGuards } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { type Response } from 'express'
import { type IncomingHttpHeaders } from 'http'
import { parseURL } from 'ufo'
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js'
import { AuthzGuard } from '../authz/authz.guard.js'
import { OpenAPIDocService } from './openapi-doc.service.js'

@Controller('openapi')
@ApiExcludeController()
export class OpenAPIDocController {
  constructor(private readonly openAPIService: OpenAPIDocService) {}

  @Get('docs/tables/:tableId')
  @UseGuards(JwtAuthGuard, AuthzGuard)
  public async doc(@Res() res: Response, @Param('tableId') tableId: string, @Headers() headers: IncomingHttpHeaders) {
    const referer = headers.referer
    const parsed = parseURL(referer)
    const host = parsed.host && parsed.protocol ? `${parsed.protocol}//${parsed.host}` : ''

    const html = await this.openAPIService.generateDoc(tableId, host)

    res.type('html')
    res.send(html)
  }

  @Get('docs/tables/:tableId/export')
  public async export(
    @Res({ passthrough: true }) res: Response,
    @Param('tableId') tableId: string,
    @Headers() headers: IncomingHttpHeaders,
    @Query('type') type?: string,
  ) {
    const referer = headers.referer
    const parsed = parseURL(referer)
    const host = parsed.host && parsed.protocol ? `${parsed.protocol}//${parsed.host}` : ''

    const { name, buffer } = await this.openAPIService.export(tableId, type, host)

    res.set({
      'Content-Disposition': `attachment; filename=${name}`,
    })

    return new StreamableFile(buffer)
  }
}
