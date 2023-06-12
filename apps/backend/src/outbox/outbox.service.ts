import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { EntityManager, Outbox, OutboxService } from '@undb/sqlite'

@Injectable()
export class NestOutboxService extends OutboxService {
  constructor(protected readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }

  @UseRequestContext()
  find(): Promise<Outbox[]> {
    return super.find()
  }

  @UseRequestContext()
  delete(ids: string[]): Promise<void> {
    return super.delete(ids)
  }
}
