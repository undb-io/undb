import { CreateRequestContext, MikroORM } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { Base, type BaseSpecification } from '@undb/core'
import { BaseSqliteRepository, EntityManager } from '@undb/sqlite'
import type { Option } from 'oxide.ts'

export const BASE_REPOSITORY = Symbol('BASE_REPOSITORY')

export const InjectBaseRepository = () => Inject(BASE_REPOSITORY)

@Injectable()
export class NestBaseSqliteRepository extends BaseSqliteRepository {
  constructor(
    public readonly orm: MikroORM,
    em: EntityManager,
  ) {
    super(em)
  }

  @CreateRequestContext()
  find(spec: BaseSpecification): Promise<Base[]> {
    return super.find(spec)
  }

  @CreateRequestContext()
  findOneById(id: string): Promise<Option<Base>> {
    return super.findOneById(id)
  }

  @CreateRequestContext()
  insert(base: Base): Promise<void> {
    return super.insert(base)
  }

  @CreateRequestContext()
  updateOneById(id: string, spec: BaseSpecification): Promise<void> {
    return super.updateOneById(id, spec)
  }

  @CreateRequestContext()
  deleteOneById(id: string): Promise<void> {
    return super.deleteOneById(id)
  }
}
