import { MikroORM, UseRequestContext } from '@mikro-orm/core'
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

  @UseRequestContext()
  find(spec: BaseSpecification): Promise<Base[]> {
    return super.find(spec)
  }

  @UseRequestContext()
  findOneById(id: string): Promise<Option<Base>> {
    return super.findOneById(id)
  }

  @UseRequestContext()
  insert(base: Base): Promise<void> {
    return super.insert(base)
  }

  @UseRequestContext()
  updateOneById(id: string, spec: BaseSpecification): Promise<void> {
    return super.updateOneById(id, spec)
  }

  @UseRequestContext()
  deleteOneById(id: string): Promise<void> {
    return super.deleteOneById(id)
  }
}
