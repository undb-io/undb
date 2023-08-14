import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { type IExportType } from '@undb/core'
import { ExportGridCommand } from '@undb/cqrs'
import { type Response } from 'express'
import { JwtAuthGuard } from '../../auth/jwt-auth.guard.js'
import { AuthzGuard } from '../../authz/authz.guard.js'
import { Permissions } from '../../authz/rbac/permission.decorator.js'
import { NestRecordExportorService } from './exportor/exportor.service.js'

@Controller('record')
@UseGuards(JwtAuthGuard, AuthzGuard)
export class RecordController {
  constructor(
    private commandBus: CommandBus,
    private readonly service: NestRecordExportorService,
  ) {}

  @Get('export/grid/:tableId/:viewId/:type')
  @Permissions('table:export')
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
