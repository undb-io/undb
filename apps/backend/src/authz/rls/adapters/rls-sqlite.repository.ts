import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { RLS, type RLSSpecification } from '@undb/authz'
import { EntityManager, RLSSqliteRepository } from '@undb/sqlite'

export const RLS_REPOSITORY = Symbol('RLS_REPOSITORY')

export const InjectRLSRepository = () => Inject(RLS_REPOSITORY)

@Injectable()
export class NestRLSSqliteRepository extends RLSSqliteRepository {
  constructor(
    protected readonly orm: MikroORM,
    em: EntityManager,
  ) {
    super(em)
  }

  @UseRequestContext()
  find(spec: RLSSpecification): Promise<RLS[]> {
    return super.find(spec)
  }

  @UseRequestContext()
  insert(rls: RLS): Promise<void> {
    return super.insert(rls)
  }
}
