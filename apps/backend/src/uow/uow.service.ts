import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { EntityManager, SqliteUnitOfWork } from '@undb/sqlite'

export const UNIT_OF_WORK = Symbol('UNIT_OF_WORK')

export const InjectUnitOfWork = () => Inject(UNIT_OF_WORK)

@Injectable()
export class NestSqliteUnitOfWork extends SqliteUnitOfWork {
  constructor(public readonly orm: MikroORM, em: EntityManager) {
    super(em)
  }

  @UseRequestContext()
  async begin(): Promise<void> {
    await super.begin()
  }
  @UseRequestContext()
  async commit(): Promise<void> {
    await super.commit()
  }
  @UseRequestContext()
  async rollback(): Promise<void> {
    await super.rollback()
  }
}
