import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { type FLSSpecification } from '@undb/authz'
import { EntityManager, FLSSqliteQueryModel } from '@undb/sqlite'

export const FLS_QUERY_MODEL = Symbol('FLS_QUERY_MODEL')

export const InjectFLSQueryModel = () => Inject(FLS_QUERY_MODEL)

@Injectable()
export class NestFLSSqliteQueryModel extends FLSSqliteQueryModel {
  constructor(
    protected readonly orm: MikroORM,
    em: EntityManager,
  ) {
    super(em)
  }

  @UseRequestContext()
  find(spec: FLSSpecification) {
    return super.find(spec)
  }
}
