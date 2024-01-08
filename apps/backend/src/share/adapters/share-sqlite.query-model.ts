import type { EntityManager } from '@mikro-orm/better-sqlite'
import { CreateRequestContext, MikroORM } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import type { IQueryShare } from '@undb/integrations'
import { type ShareSpecification } from '@undb/integrations'
import { ShareSqliteQueryModel } from '@undb/sqlite'
import type { Option } from 'oxide.ts'

export const SHARE_QUERY_MODEL = Symbol('SHARE_QUERY_MODEL')
export const InjectShareQueryModel = () => Inject(SHARE_QUERY_MODEL)

@Injectable()
export class NestShareSqliteQueryModel extends ShareSqliteQueryModel {
  constructor(public readonly orm: MikroORM) {
    super(orm.em as EntityManager)
  }

  @CreateRequestContext()
  find(spec: ShareSpecification | null): Promise<IQueryShare[]> {
    return super.find(spec)
  }

  @CreateRequestContext()
  findOne(spec: ShareSpecification): Promise<Option<IQueryShare>> {
    return super.findOne(spec)
  }

  @CreateRequestContext()
  findOneById(id: string): Promise<Option<IQueryShare>> {
    return super.findOneById(id)
  }
}
