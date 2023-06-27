import type { Share as CoreShare, IQueryShare } from '@undb/integrations'
import { ShareFactory } from '@undb/integrations'
import type { Share } from '../../entity/share.js'

export class ShareSqliteMapper {
  static toQuery(share: Share): IQueryShare {
    return {
      id: share.id,
      target: share.targetId && share.targetType ? { id: share.targetId, type: share.targetType as any } : null,
      enabled: share.enabled,
    }
  }

  static toDomain(share: Share): CoreShare {
    return ShareFactory.unsafeCreate({
      id: share.id,
      target: share.targetId && share.targetType ? { id: share.targetId, type: share.targetType as any } : null,
      enabled: share.enabled,
    })
  }
}
