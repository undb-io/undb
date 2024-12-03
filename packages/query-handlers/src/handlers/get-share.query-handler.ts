import { injectSpaceMemberService, type ISpaceMemberService } from "@undb/authz"
import { injectContext, type IContext } from "@undb/context"
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
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute({ shareId }: IGetShareQuery): Promise<IShareDTO> {
    const userId = this.context.mustGetCurrentUserId()
    const space = await this.spaceSvc.setSpaceContext(this.context, { shareId })
    await this.spaceMemberSvc.setSpaceMemberContext(this.context, space.id.value, userId)

    return (await this.svc.getShare(shareId)).unwrap()
  }
}
