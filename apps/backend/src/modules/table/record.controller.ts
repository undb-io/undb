import { Controller, Get, Param, Res } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ExportGridCommand } from '@undb/cqrs'
import type { Response } from 'express'

@Controller('record')
export class RecordController {
  constructor(private commandBus: CommandBus) {}

  @Get('export/grid/:tableId/:viewId')
  async exportGrid(@Param('tableId') tableId: string, @Param('viewId') viewId: string, @Res() res: Response) {
    const cmd = new ExportGridCommand({ tableId, viewId })
    const data = await this.commandBus.execute(cmd)

    res.header('Content-Type', 'text/csv')

    return res.send(data)
  }
}
