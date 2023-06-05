import { Controller, Get, Res } from '@nestjs/common'
import { createRedocHTML } from '@undb/openapi'
import { type Response } from 'express'

@Controller('openapi')
export class OpenAPIController {
  @Get()
  public openAPI(@Res() res: Response) {
    const html = createRedocHTML()

    res.type('html')
    res.send(html)
  }
}
