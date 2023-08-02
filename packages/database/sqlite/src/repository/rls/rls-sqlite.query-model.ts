import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IQueryRLS, IRLSQueryModel, RLSSpecification } from '@undb/authz'
import { RLS } from '../../entity/rls.js'
import { RLSSqliteMapper } from './rls-sqlite.mapper.js'
import { RLSSqliteQueryVisitor } from './rls-sqlite.query-visitor.js'

export class RLSSqliteQueryModel implements IRLSQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(spec: RLSSpecification): Promise<IQueryRLS[]> {
    const em = this.em.fork()
    const qb = em.qb(RLS)
    const visitor = new RLSSqliteQueryVisitor(em, qb)

    spec.accept(visitor)

    const results = await qb.getResultList()

    return results.map((r) => RLSSqliteMapper.toQuery(r))
  }
}
