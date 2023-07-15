import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type { IShareSpecVisitor, WithShareEnabled, WithShareForm, WithShareId, WithShareView } from '@undb/integrations'
import { Share } from '../../entity/share.js'

export class ShareSqliteMutationVisitor implements IShareSpecVisitor {
  constructor(private readonly shareId: string, private readonly em: EntityManager) {}
  idEqual(s: WithShareId): void {
    throw new Error('Method not implemented.')
  }
  targetView(s: WithShareView): void {
    const share = this.em.getReference(Share, this.shareId)
    const {
      properties: { targetId, targetType },
    } = this.em.getMetadata().get(Share.name)
    wrap(share).assign({
      [targetId.fieldNames[0]]: s.viewId,
      [targetType.fieldNames[0]]: 'view',
    })
  }
  targetForm(s: WithShareForm): void {
    const share = this.em.getReference(Share, this.shareId)
    const {
      properties: { targetId, targetType },
    } = this.em.getMetadata().get(Share.name)
    wrap(share).assign({
      [targetId.fieldNames[0]]: s.formId,
      [targetType.fieldNames[0]]: 'form',
    })
  }
  enabled(s: WithShareEnabled): void {
    const share = this.em.getReference(Share, this.shareId)
    wrap(share).assign({
      enabled: s.enabled,
    })
  }

  or(): IShareSpecVisitor {
    throw new Error('not implemented')
  }

  not(): IShareSpecVisitor {
    throw new Error('not implemented')
  }
}
