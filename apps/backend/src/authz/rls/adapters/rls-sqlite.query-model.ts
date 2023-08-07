import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { type RLSSpecification } from '@undb/authz'
import { EntityManager, RLSSqliteQueryModel } from '@undb/sqlite'

export const RLS_QUERY_MODEL = Symbol('RLS_QUERY_MODEL')

export const InjectRLSQueryModel = () => Inject(RLS_QUERY_MODEL)

@Injectable()
export class NestRLSSqliteQueryModel extends RLSSqliteQueryModel {
  constructor(
    protected readonly orm: MikroORM,
    em: EntityManager,
  ) {
    super(em)
  }

  @UseRequestContext()
  find(spec: RLSSpecification) {
    return super.find(spec)
  }
}
