import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type IQueryHandler } from "@undb/domain"
import { GetMemberSpacesQuery, type IGetMemberSpacesOutput } from "@undb/queries"
import { injectSpaceService, type ISpaceService } from "@undb/space"

@queryHandler(GetMemberSpacesQuery)
@singleton()
export class GetMemberSpacesQueryHandler implements IQueryHandler<GetMemberSpacesQuery, IGetMemberSpacesOutput> {
  constructor(
    @injectSpaceService()
    private readonly service: ISpaceService,
  ) {}

  async execute(query: GetMemberSpacesQuery): Promise<IGetMemberSpacesOutput> {
    return this.service.getMemberSpaces(query.userId)
  }
}
