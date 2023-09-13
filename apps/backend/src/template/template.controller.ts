import { Controller, Get, Param, Res } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ExportTemplateCommand } from '@undb/cqrs'
import type { Template } from '@undb/template'
import { type Response } from 'express'
import type { Option } from 'oxide.ts'

@Controller('templates')
export class TemplateController {
  constructor(private readonly commandBus: CommandBus) {}

  @Get('export/tables/:tableId')
  async exportTable(@Param('tableId') tableId: string, @Res() res: Response) {
    const template: Option<Template> = await this.commandBus.execute<ExportTemplateCommand>(
      new ExportTemplateCommand({ tableId }),
    )

    if (template.isNone()) return

    const buffer = Buffer.from(JSON.stringify(template.unwrap()))
    res.header('Content-Type', 'application/json')
    return res.send(buffer)
  }
}
