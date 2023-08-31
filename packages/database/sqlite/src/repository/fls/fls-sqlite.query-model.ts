import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { FLSSpecification, IFLSQueryModel, IQueryFLS } from '@undb/authz'
import { FLS } from '../../entity/fls.js'
import { FLSSqliteMapper } from './fls-sqlite.mapper.js'
import { FLSSqliteQueryVisitor } from './fls-sqlite.query-visitor.js'

export class FLSSqliteQueryModel implements IFLSQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(spec: FLSSpecification): Promise<IQueryFLS[]> {
    const em = this.em.fork()
    const qb = em.qb(FLS)
    const visitor = new FLSSqliteQueryVisitor(em, qb)

    spec.accept(visitor)

    const results = await qb.getResultList()

    return results.map((r) => FLSSqliteMapper.toQuery(r))
  }
}
