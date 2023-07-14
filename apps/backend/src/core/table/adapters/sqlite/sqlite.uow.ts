import { EntityManager, MikroORM } from '@mikro-orm/better-sqlite'
import { UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable, Scope } from '@nestjs/common'
import { SqliteUnitOfWork } from '@undb/sqlite'

export const UNIT_OF_WORK = Symbol('UNIT_OF_WORK')
export const InjectUnitOfWork = () => Inject(UNIT_OF_WORK)

@Injectable({ scope: Scope.REQUEST })
export class NestSqliteUnitOfWork extends SqliteUnitOfWork {
  constructor(orm: MikroORM, em: EntityManager) {
    super(em.fork())
  }

  @UseRequestContext()
  begin(): Promise<void> {
    return super.begin()
  }
  @UseRequestContext()
  commit(): Promise<void> {
    return super.commit()
  }
  @UseRequestContext()
  rollback(): Promise<void> {
    return super.rollback()
  }
}
