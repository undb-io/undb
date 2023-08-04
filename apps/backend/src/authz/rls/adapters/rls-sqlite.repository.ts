import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { RLS, type IRLSCache, type RLSSpecification } from '@undb/authz'
import { EntityManager, RLSSqliteRepository } from '@undb/sqlite'
import type { Option } from 'oxide.ts'
import { InjectRLSCache } from './rls-kv.cache.js'

export const RLS_REPOSITORY = Symbol('RLS_REPOSITORY')

export const InjectRLSRepository = () => Inject(RLS_REPOSITORY)

@Injectable()
export class NestRLSSqliteRepository extends RLSSqliteRepository {
  constructor(
    protected readonly orm: MikroORM,
    em: EntityManager,
    @InjectRLSCache()
    protected readonly cache: IRLSCache,
  ) {
    super(em, cache)
  }

  @UseRequestContext()
  find(spec: RLSSpecification): Promise<RLS[]> {
    return super.find(spec)
  }

  @UseRequestContext()
  findOneById(id: string): Promise<Option<RLS>> {
    return super.findOneById(id)
  }

  @UseRequestContext()
  insert(rls: RLS): Promise<void> {
    return super.insert(rls)
  }

  @UseRequestContext()
  updateOneById(id: string, spec: RLSSpecification): Promise<void> {
    return super.updateOneById(id, spec)
  }

  @UseRequestContext()
  deleteOneById(id: string): Promise<void> {
    return super.deleteOneById(id)
  }
}
