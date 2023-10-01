import { CommandHandler } from '@nestjs/cqrs'
import type { ClsStore, IClsService } from '@undb/core'
import { type BaseRepository, type IRecordRepository, type ITableRepository } from '@undb/core'
import { CreateBaseCommand, CreateBaseCommandHandler } from '@undb/cqrs'
import { ClsService } from 'nestjs-cls'
import { InjectRecordRepository } from '../../core/table/adapters/sqlite/record-sqlite.repository.js'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { InjectBaseRepository } from '../adapters/base-sqlite.repository.js'

@CommandHandler(CreateBaseCommand)
export class NestCreateBaseCommandHandler extends CreateBaseCommandHandler {
  constructor(
    cls: ClsService<ClsStore>,
    @InjectBaseRepository()
    repo: BaseRepository,
    @InjectTableRepository()
    tableRepo: ITableRepository,
    @InjectRecordRepository()
    recordRepo: IRecordRepository,
  ) {
    super(cls as IClsService<ClsStore>, repo, tableRepo, recordRepo)
  }
}
