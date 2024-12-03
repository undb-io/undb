import { injectSpaceMemberService, type ISpaceMemberService } from "@undb/authz"
import { injectContext, type IContext } from "@undb/context"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetTableByShareBaseQuery, type IGetTableByShareBaseQuery } from "@undb/queries"
import { injectShareService, type IShareService } from "@undb/share"
import { injectSpaceService, type ISpaceService } from "@undb/space"
import { type ITableDTO } from "@undb/table"

@queryHandler(GetTableByShareBaseQuery)
@singleton()
export class GetTableByShareBaseQueryHandler implements IQueryHandler<any, ITableDTO> {
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

  async execute(query: IGetTableByShareBaseQuery): Promise<ITableDTO> {
    const userId = this.context.mustGetCurrentUserId()
    const space = await this.spaceSvc.setSpaceContext(this.context, { shareId: query.shareId })
    await this.spaceMemberSvc.setSpaceMemberContext(this.context, space.id.value, userId)

    return this.svc.getTableByShareBase(query.shareId, query.tableId)
  }
}
