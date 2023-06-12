import { MikroORM } from '@mikro-orm/core'
import { Injectable } from '@nestjs/common'
import { EntityManager, OutboxService } from '@undb/sqlite'

@Injectable()
export class NestOutboxService extends OutboxService {
  constructor(protected readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }
}
