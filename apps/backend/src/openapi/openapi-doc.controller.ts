import { Controller, Get, Header, Param, Res, UseGuards } from '@nestjs/common'
import { type Response } from 'express'
import { Readable } from 'stream'
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
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="package.json"')
  public async export(@Res() res: Response, @Param('tableId') tableId: string) {
    const spec = await this.openAPIService.getSpec(tableId)

    const buffer = Buffer.from(JSON.stringify(spec))

    const stream = new Readable()
    stream.push(buffer)
    stream.push(null)

    stream.pipe(res)
  }
}
