import { Controller, Get, Param, Res } from '@nestjs/common'
import { type Response } from 'express'
import { OpenAPIService } from './openapi.service.js'

@Controller('openapi')
export class OpenAPIController {
  constructor(private readonly openAPIService: OpenAPIService) {}

  @Get('tables/:tableId')
  public async doc(@Res() res: Response, @Param('tableId') tableId: string) {
    const html = await this.openAPIService.generateDoc(tableId)

    res.type('html')
    res.send(html)
  }
}
