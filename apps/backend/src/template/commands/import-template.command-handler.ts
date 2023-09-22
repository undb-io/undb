import { CommandHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { type IRecordRepository, type ITableRepository } from '@undb/core'
import { ImportTemplateCommand, ImportTemplateCommandHandler } from '@undb/cqrs'
import { ClsService } from 'nestjs-cls'
import { InjectRecordRepository } from '../../core/table/adapters/sqlite/record-sqlite.repository.js'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'

@CommandHandler(ImportTemplateCommand)
export class NestImportTemplateCommandHandler extends ImportTemplateCommandHandler {
  constructor(
    @InjectTableRepository()
    repo: ITableRepository,
    @InjectRecordRepository()
    recordRepo: IRecordRepository,
    cls: ClsService<ClsStore>,
  ) {
    super(repo, recordRepo, cls as IClsService<ClsStore>)
  }
}
