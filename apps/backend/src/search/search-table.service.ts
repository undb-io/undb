import { Injectable } from '@nestjs/common'
import { type IRecordRepository } from '@undb/core'
import { type IUnitOfWork } from '@undb/domain'
import { EntityManager, SearchTableService } from '@undb/sqlite'
import { InjectRecordRepository } from '../core/table/adapters/sqlite/record-sqlite.repository.js'
import { InjectUnitOfWork } from '../uow/uow.service.js'

@Injectable()
export class NestSearchTableService extends SearchTableService {
  constructor(
    @InjectUnitOfWork()
    protected readonly uow: IUnitOfWork<EntityManager>,
    @InjectRecordRepository()
    protected readonly repo: IRecordRepository,
  ) {
    super(uow, repo)
  }
}
