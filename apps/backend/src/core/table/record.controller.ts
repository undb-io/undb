import { Controller, Get, Param, Res } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { type IExportType } from '@undb/core'
import { ExportGridCommand } from '@undb/cqrs'
import type { Response } from 'express'
import { NestRecordExportorService } from './exportor/exportor.service.js'

@Controller('record')
export class RecordController {
  constructor(private commandBus: CommandBus, private readonly service: NestRecordExportorService) {}

  @Get('export/grid/:tableId/:viewId/:type')
  async exportGrid(
    @Param('tableId') tableId: string,
    @Param('viewId') viewId: string,
    @Param('type') type: IExportType,
    @Res() res: Response,
  ) {
    const cmd = new ExportGridCommand({ tableId, viewId, type })
    const data = await this.commandBus.execute(cmd)

    const contentType = this.service.getContentType(type)
    res.header('Content-Type', contentType)

    return res.send(data)
  }
}
