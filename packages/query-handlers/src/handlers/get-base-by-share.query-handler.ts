import { injectSpaceMemberService, type ISpaceMemberService } from "@undb/authz"
import { type IBaseDTO } from "@undb/base"
import { injectContext, type IContext } from "@undb/context"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetBaseByShareQuery, type IGetBaseByShareQuery } from "@undb/queries"
import { injectShareService, type IShareService } from "@undb/share"
import { injectSpaceService, type ISpaceService } from "@undb/space"

@queryHandler(GetBaseByShareQuery)
@singleton()
export class GetBaseByShareQueryHandler implements IQueryHandler<any, IBaseDTO> {
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

  async execute(query: IGetBaseByShareQuery): Promise<IBaseDTO> {
    const userId = this.context.mustGetCurrentUserId()
    const space = await this.spaceSvc.setSpaceContext(this.context, { shareId: query.shareId })
    await this.spaceMemberSvc.setSpaceMemberContext(this.context, space.id.value, userId)

    return this.svc.getBaseByShare(query.shareId)
  }
}
