import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import { ShareFactory, type IShareDTO, type IShareTarget, type Share as ShareDo } from "@undb/share"
import type { Share } from "../tables"

@singleton()
export class ShareMapper implements Mapper<ShareDo, Share, IShareDTO> {
  toDo(entity: Share): ShareDo {
    return ShareFactory.fromJSON({
      id: entity.id,
      target: {
        type: entity.targetType,
        id: entity.targetId,
      } as IShareTarget,
      enabled: entity.enabled,
    })
  }
  toEntity(domain: ShareDo): Share {
    return {
      id: domain.id.value,
      targetId: domain.target.id,
      targetType: domain.target.type,
      enabled: domain.enabled,
    }
  }
  toDTO(entity: Share): IShareDTO {
    return {
      id: entity.id,
      target: {
        id: entity.targetId,
        type: entity.targetType,
      } as IShareTarget,
      enabled: entity.enabled,
    }
  }
}
