import { injectSpaceMemberService, type ISpaceMemberService } from "@undb/authz"
import { getCurrentUserId, setContextValue } from "@undb/context/server"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetShareQuery, type IGetShareQuery } from "@undb/queries"
import { injectShareService, type IShareDTO, type IShareService } from "@undb/share"
import { injectSpaceService, type ISpaceService } from "@undb/space"

@queryHandler(GetShareQuery)
@singleton()
export class GetShareQueryHandler implements IQueryHandler<any, IShareDTO> {
  constructor(
    @injectShareService()
    private readonly svc: IShareService,
    @injectSpaceService()
    private readonly spaceSvc: ISpaceService,
    @injectSpaceMemberService()
    private readonly spaceMemberSvc: ISpaceMemberService,
  ) {}

  async execute({ shareId }: IGetShareQuery): Promise<IShareDTO> {
    const userId = getCurrentUserId()
    const space = await this.spaceSvc.setSpaceContext(setContextValue, { shareId })
    await this.spaceMemberSvc.setSpaceMemberContext(setContextValue, space.id.value, userId)

    return (await this.svc.getShare(shareId)).unwrap()
  }
}
