import type { EntityManager } from '@mikro-orm/better-sqlite'
import { CreateRequestContext, MikroORM } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { type Share, type ShareSpecification } from '@undb/integrations'
import { ShareSqliteRepository } from '@undb/sqlite'
import type { Option } from 'oxide.ts'

export const SHARE_REPOSITORY = Symbol('SHARE_REPOSITORY')
export const InjectShareRepository = () => Inject(SHARE_REPOSITORY)

@Injectable()
export class NestShareSqliteRepository extends ShareSqliteRepository {
  constructor(public readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }

  @CreateRequestContext()
  async findOneById(id: string): Promise<Option<Share>> {
    return super.findOneById(id)
  }

  @CreateRequestContext()
  async findOne(spec: ShareSpecification): Promise<Option<Share>> {
    return super.findOne(spec)
  }

  @CreateRequestContext()
  async insert(table: Share): Promise<void> {
    return super.insert(table)
  }

  @CreateRequestContext()
  async updateOneById(id: string, spec: ShareSpecification): Promise<void> {
    return super.updateOneById(id, spec)
  }

  @CreateRequestContext()
  async deleteOneById(id: string): Promise<void> {
    return super.deleteOneById(id)
  }
}
