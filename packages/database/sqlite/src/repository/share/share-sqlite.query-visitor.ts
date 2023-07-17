import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import type { IShareSpecVisitor, WithShareEnabled, WithShareForm, WithShareId, WithShareView } from '@undb/integrations'
import { Share } from '../../entity/share.js'

export class ShareSqliteQueryVisitor implements IShareSpecVisitor {
  constructor(private readonly em: EntityManager, private qb: QueryBuilder<Share>) {}
  idEqual(s: WithShareId): void {
    this.qb.andWhere({ id: s.shareId })
  }

  targetView(s: WithShareView): void {
    const {
      properties: { targetId, targetType },
    } = this.em.getMetadata().get(Share.name)
    this.qb.andWhere({
      [targetId.fieldNames[0]]: s.viewId,
      [targetType.fieldNames[0]]: 'view',
    })
  }

  targetForm(s: WithShareForm): void {
    const {
      properties: { targetId, targetType },
    } = this.em.getMetadata().get(Share.name)
    this.qb.andWhere({
      [targetId.fieldNames[0]]: s.formId,
      [targetType.fieldNames[0]]: 'form',
    })
  }

  enabled(s: WithShareEnabled): void {
    this.qb.andWhere({ enabled: s.enabled })
  }

  or(): IShareSpecVisitor {
    throw new Error('not implemented')
  }

  not(): IShareSpecVisitor {
    throw new Error('not implemented')
  }
}
