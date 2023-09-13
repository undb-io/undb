import { CommandHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { type ITableRepository } from '@undb/core'
import { ImportTemplateCommand, ImportTemplateCommandHandler } from '@undb/cqrs'
import { ClsService } from 'nestjs-cls'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(ImportTemplateCommand)
export class NestImportTemplateCommandHandler extends ImportTemplateCommandHandler {
  constructor(
    @InjectTableRepository()
    repo: ITableRepository,
    cls: ClsService<ClsStore>,
  ) {
    super(repo, cls as IClsService<ClsStore>)
  }
}
