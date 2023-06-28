import { MikroORM } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import type { EntityManager } from '@undb/sqlite'
import { SqliteUnitOfWork } from '@undb/sqlite'

export const UNIT_OF_WORK = Symbol('UNIT_OF_WORK')

export const InjectUnitOfWork = () => Inject(UNIT_OF_WORK)

@Injectable()
export class NestSqliteUnitOfWork extends SqliteUnitOfWork {
  constructor(orm: MikroORM) {
    super(orm.em as EntityManager)
  }
}
