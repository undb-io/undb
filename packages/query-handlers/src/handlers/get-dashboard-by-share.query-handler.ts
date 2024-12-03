import { injectSpaceMemberService, type ISpaceMemberService } from "@undb/authz"
import { injectContext, type IContext } from "@undb/context"
import { queryHandler } from "@undb/cqrs"
import type { IDashboardDTO } from "@undb/dashboard"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetDashboardByShareQuery, type IGetDashboardByShareQuery } from "@undb/queries"
import { injectShareService, type IShareService } from "@undb/share"
import { injectSpaceService, type ISpaceService } from "@undb/space"

@queryHandler(GetDashboardByShareQuery)
@singleton()
export class GetDashboardByShareQueryHandler implements IQueryHandler<any, IDashboardDTO> {
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

  async execute(query: IGetDashboardByShareQuery): Promise<IDashboardDTO> {
    const userId = this.context.mustGetCurrentUserId()
    const space = await this.spaceSvc.setSpaceContext(this.context, { shareId: query.shareId })
    await this.spaceMemberSvc.setSpaceMemberContext(this.context, space.id.value, userId)

    return this.svc.getDashboardByShare(query.shareId)
  }
}
