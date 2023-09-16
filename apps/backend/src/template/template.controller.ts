import { Body, Controller, Param, Post, Res } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ExportTemplateCommand } from '@undb/cqrs'
import type { Template } from '@undb/template'
import { type Response } from 'express'
import type { Option } from 'oxide.ts'

@Controller('templates')
export class TemplateController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('export/tables/:tableId')
  async exportTable(@Param('tableId') tableId: string, @Body('recordIds') recordIds: string[], @Res() res: Response) {
    const template: Option<Template> = await this.commandBus.execute<ExportTemplateCommand>(
      new ExportTemplateCommand({ tableId, recordIds }),
    )

    if (template.isNone()) return

    const buffer = Buffer.from(JSON.stringify(template.unwrap()))
    res.header('Content-Type', 'application/json')
    return res.send(buffer)
  }
}
