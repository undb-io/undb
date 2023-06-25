import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { type IUnitOfWork } from '@undb/domain'
import { EntityManager, Outbox, OutboxService } from '@undb/sqlite'
import { InjectUnitOfWork } from '../uow/uow.service.js'

@Injectable()
export class NestOutboxService extends OutboxService {
  constructor(
    @InjectUnitOfWork()
    protected readonly uow: IUnitOfWork<EntityManager>,
    public readonly orm: MikroORM,
  ) {
    super(uow)
  }

  @UseRequestContext()
  handle(cb: (outboxList: Outbox[]) => void | Promise<void>): Promise<void> {
    return super.handle(cb)
  }
}
