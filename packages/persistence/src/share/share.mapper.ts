import { injectContext, type IContext } from "@undb/context"
import { singleton } from "@undb/di"
import type { Mapper } from "@undb/domain"
import { ShareFactory, type IShareDTO, type IShareTarget, type Share as ShareDo } from "@undb/share"
import type { Share } from "../db"

@singleton()
export class ShareMapper implements Mapper<ShareDo, Share, IShareDTO> {
  constructor(
    @injectContext()
    private readonly context: IContext,
  ) {}

  toDo(entity: Share): ShareDo {
    return ShareFactory.fromJSON({
      id: entity.id,
      target: {
        type: entity.target_type,
        id: entity.target_id,
      } as IShareTarget,
      enabled: entity.enabled,
      spaceId: entity.space_id,
    })
  }
  toEntity(domain: ShareDo): Share {
    return {
      id: domain.id.value,
      target_id: domain.target.id,
      target_type: domain.target.type,
      space_id: this.context.mustGetCurrentSpaceId(),
      enabled: domain.enabled,
    }
  }
  toDTO(entity: Share): IShareDTO {
    return {
      id: entity.id,
      target: {
        id: entity.target_id,
        type: entity.target_type,
      } as IShareTarget,
      spaceId: entity.space_id,
      enabled: entity.enabled,
    }
  }
}
