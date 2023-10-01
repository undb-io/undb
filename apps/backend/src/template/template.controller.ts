import { Body, Controller, Param, Post, Res } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ExportBaseTemplateCommand, ExportTableTemplateCommand } from '@undb/cqrs'
import type { Template } from '@undb/template'
import { type Response } from 'express'
import type { Option } from 'oxide.ts'

@Controller('templates')
export class TemplateController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('export/tables/:tableId')
  async exportTable(@Param('tableId') tableId: string, @Body('recordIds') recordIds: string[], @Res() res: Response) {
    const template: Option<Template> = await this.commandBus.execute<ExportTableTemplateCommand>(
      new ExportTableTemplateCommand({ tableId, recordIds }),
    )

    if (template.isNone()) return

    const buffer = Buffer.from(JSON.stringify(template.unwrap()))
    res.header('Content-Type', 'application/json')
    return res.send(buffer)
  }

  @Post('export/bases/:baseId')
  async exportBase(@Param('baseId') baseId: string, @Res() res: Response) {
    const template: Option<Template> = await this.commandBus.execute<ExportBaseTemplateCommand>(
      new ExportBaseTemplateCommand({ baseId }),
    )

    if (template.isNone()) return

    const buffer = Buffer.from(JSON.stringify(template.unwrap()))
    res.header('Content-Type', 'application/json')
    return res.send(buffer)
  }
}
