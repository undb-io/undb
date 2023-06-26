import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IQueryShare, IShareQueryModel, ShareSpecification } from '@undb/integrations'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { Share } from '../../entity/share.js'
import { ShareSqliteMapper } from './share-sqlite.mapper.js'
import { ShareSqliteQueryVisitor } from './share-sqlite.query-visitor.js'

export class ShareSqliteQueryModel implements IShareQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(spec: ShareSpecification | null): Promise<IQueryShare[]> {
    const qb = this.em.qb(Share)

    const visitor = new ShareSqliteQueryVisitor(this.em, qb)
    if (spec) spec.accept(visitor)

    const webhooks = await qb.getResult()

    return webhooks.map((webhook) => ShareSqliteMapper.toQuery(webhook))
  }

  async findOneById(id: string): Promise<Option<IQueryShare>> {
    const webhook = await this.em.findOne(Share, id)
    if (!webhook) {
      return None
    }
    return Some(ShareSqliteMapper.toQuery(webhook))
  }

  async findOne(spec: ShareSpecification): Promise<Option<IQueryShare>> {
    const qb = this.em.qb(Share)
    const visitor = new ShareSqliteQueryVisitor(this.em, qb)

    spec.accept(visitor)

    const webhook = await qb.getSingleResult()
    if (!webhook) return None

    return Some(ShareSqliteMapper.toQuery(webhook))
  }
}
