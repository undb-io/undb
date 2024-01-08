import { CreateRequestContext, MikroORM } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { FLS, type FLSSpecification, type IFLSCache } from '@undb/authz'
import { EntityManager, FLSSqliteRepository } from '@undb/sqlite'
import type { Option } from 'oxide.ts'
import { InjectFLSCache } from './fls-kv.cache.js'

export const FLS_REPOSITORY = Symbol('FLS_REPOSITORY')

export const InjectFLSRepository = () => Inject(FLS_REPOSITORY)

@Injectable()
export class NestFLSSqliteRepository extends FLSSqliteRepository {
  constructor(
    protected readonly orm: MikroORM,
    em: EntityManager,
    @InjectFLSCache()
    protected readonly cache: IFLSCache,
  ) {
    super(em, cache)
  }

  @CreateRequestContext()
  find(spec: FLSSpecification): Promise<FLS[]> {
    return super.find(spec)
  }

  @CreateRequestContext()
  findOneById(id: string): Promise<Option<FLS>> {
    return super.findOneById(id)
  }

  @CreateRequestContext()
  insert(fls: FLS): Promise<void> {
    return super.insert(fls)
  }

  @CreateRequestContext()
  updateOneById(id: string, spec: FLSSpecification): Promise<void> {
    return super.updateOneById(id, spec)
  }

  @CreateRequestContext()
  deleteOneById(id: string): Promise<void> {
    return super.deleteOneById(id)
  }
}
