import { Controller, Get, Param, Res } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { ExportGridCommand } from '@undb/cqrs'
import type { Response } from 'express'

@Controller('record')
export class RecordController {
  constructor(private commandBus: CommandBus) {}

  @Get('export/grid/:tableId/:viewId/:type')
  async exportGrid(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Param('type') type: 'csv' | 'excel',
    @Res() res: Response,
  ) {
    const cmd = new ExportGridCommand({ tableId, viewId, type })
    const data = await this.commandBus.execute(cmd)
    if (type === 'csv') {
      res.header('Content-Type', 'text/csv')
    } else {
      res.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    }
    return res.send(data)
  }
}
