import type { EntityManager } from '@mikro-orm/better-sqlite'
import { type IUnitOfWork } from '@undb/domain'

export class SqliteUnitOfWork implements IUnitOfWork<EntityManager> {
  constructor(private em: EntityManager) {}

  begin(): Promise<void> {
    this.em = this.em.fork()
    return this.em.begin()
  }
  async commit(): Promise<void> {
    await this.em.commit()
  }
  rollback(): Promise<void> {
    return this.em.rollback()
  }

  conn() {
    return this.em
  }
}
