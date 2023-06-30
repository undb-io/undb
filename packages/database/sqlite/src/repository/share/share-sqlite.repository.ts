import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { Share as CoreShare, IShareRepository, ShareSpecification } from '@undb/integrations'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { Share } from '../../entity/share.js'
import { ShareSqliteMapper } from './share-sqlite.mapper.js'
import { ShareSqliteMutationVisitor } from './share-sqlite.mutation-visitor.js'
import { ShareSqliteQueryVisitor } from './share-sqlite.query-visitor.js'

export class ShareSqliteRepository implements IShareRepository {
  constructor(private readonly em: EntityManager) {}
  async insert(share: CoreShare): Promise<void> {
    const entity = new Share(share)
    await this.em.persistAndFlush(entity)
  }

  async updateOneById(id: string, spec: ShareSpecification): Promise<void> {
    const visitor = new ShareSqliteMutationVisitor(id, this.em)
    spec.accept(visitor)

    await this.em.flush()
  }

  async find(spec: ShareSpecification): Promise<CoreShare[]> {
    const qb = this.em.qb(Share)
    const visitor = new ShareSqliteQueryVisitor(this.em, qb)
    spec.accept(visitor)

    const shares = await qb.getResult()
    return shares.map((share) => ShareSqliteMapper.toDomain(share))
  }

  async findOneById(id: string): Promise<Option<CoreShare>> {
    const share = await this.em.findOne(Share, id)
    if (!share) {
      return None
    }
    return Some(ShareSqliteMapper.toDomain(share))
  }

  async findOne(spec: ShareSpecification): Promise<Option<CoreShare>> {
    const qb = this.em.qb(Share)
    const visitor = new ShareSqliteQueryVisitor(this.em, qb)
    spec.accept(visitor)

    const share = await qb.getSingleResult()
    if (!share) return None

    return Some(ShareSqliteMapper.toDomain(share))
  }

  async exists(spec: ShareSpecification): Promise<boolean> {
    const qb = this.em.qb(Share)
    const visitor = new ShareSqliteQueryVisitor(this.em, qb)

    spec.accept(visitor)

    const share = await qb.getSingleResult()
    return !!share
  }

  async deleteOneById(id: string): Promise<void> {
    await this.em.nativeDelete(Share, { id })
  }
}
