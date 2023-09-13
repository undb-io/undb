import { Injectable } from '@nestjs/common'
import { type ITableRepository } from '@undb/core'
import { TemplateService } from '@undb/template'
import { InjectTableRepository } from '../core/table/adapters/sqlite/table-sqlite.repository.js'

@Injectable()
export class NestTemplateService extends TemplateService {
  constructor(
    @InjectTableRepository()
    repo: ITableRepository,
  ) {
    super(repo)
  }
}
