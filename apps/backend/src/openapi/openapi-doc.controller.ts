import { Controller, Get, Param, Res } from '@nestjs/common'
import { type Response } from 'express'
import { OpenAPIDocService } from './openapi-doc.service.js'

@Controller('openapi')
export class OpenAPIDocController {
  constructor(private readonly openAPIService: OpenAPIDocService) {}

  @Get('docs/tables/:tableId')
  public async doc(@Res() res: Response, @Param('tableId') tableId: string) {
    const html = await this.openAPIService.generateDoc(tableId)

    res.type('html')
    res.send(html)
  }
}
