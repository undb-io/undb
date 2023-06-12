import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { EntityManager, Outbox, OutboxService } from '@undb/sqlite'

@Injectable()
export class NestOutboxService extends OutboxService {
  constructor(protected readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }

  @UseRequestContext()
  handle(cb: (outboxList: Outbox[]) => void | Promise<void>): Promise<void> {
    return super.handle(cb)
  }
}
