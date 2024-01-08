import { CreateRequestContext, MikroORM } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import type { BaseSpecification, IQueryBase } from '@undb/core'
import { BaseSqliteQueryModel, EntityManager } from '@undb/sqlite'
import { Option } from 'oxide.ts'

export const BASE_QUERY_MODEL = Symbol('BASE_QUERY_MODEL')

export const InjectBaseQueryModel = () => Inject(BASE_QUERY_MODEL)

@Injectable()
export class NestBaseSqliteQueryModel extends BaseSqliteQueryModel {
  constructor(
    public readonly orm: MikroORM,
    em: EntityManager,
  ) {
    super(em)
  }

  @CreateRequestContext()
  find(spec: Option<BaseSpecification>): Promise<IQueryBase[]> {
    return super.find(spec)
  }

  @CreateRequestContext()
  findOneById(id: string): Promise<Option<IQueryBase>> {
    return super.findOneById(id)
  }
}
