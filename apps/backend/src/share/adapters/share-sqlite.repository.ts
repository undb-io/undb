import type { EntityManager } from '@mikro-orm/better-sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
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

  @UseRequestContext()
  async findOneById(id: string): Promise<Option<Share>> {
    return super.findOneById(id)
  }

  @UseRequestContext()
  async findOne(spec: ShareSpecification): Promise<Option<Share>> {
    return super.findOne(spec)
  }

  @UseRequestContext()
  async insert(table: Share): Promise<void> {
    return super.insert(table)
  }

  @UseRequestContext()
  async updateOneById(id: string, spec: ShareSpecification): Promise<void> {
    return super.updateOneById(id, spec)
  }

  @UseRequestContext()
  async deleteOneById(id: string): Promise<void> {
    return super.deleteOneById(id)
  }
}
