import { Injectable } from '@nestjs/common'
import { type IRecordQueryModel, type ITableRepository } from '@undb/core'
import { TemplateService } from '@undb/template'
import { InjectRecordQueryModel } from '../core/table/adapters/sqlite/record-sqlite.query-model.js'
import { InjectTableRepository } from '../core/table/adapters/sqlite/table-sqlite.repository.js'

@Injectable()
export class NestTemplateService extends TemplateService {
  constructor(
    @InjectTableRepository()
    repo: ITableRepository,
    @InjectRecordQueryModel()
    qm: IRecordQueryModel,
  ) {
    super(repo, qm)
  }
}
