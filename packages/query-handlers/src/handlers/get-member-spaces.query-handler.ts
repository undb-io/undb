import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type IQueryHandler } from "@undb/domain"
import { GetMemberSpacesQuery } from "@undb/queries"
import { injectSpaceService, type ISpaceDTO, type ISpaceService } from "@undb/space"

@queryHandler(GetMemberSpacesQuery)
@singleton()
export class GetMemberSpacesQueryHandler implements IQueryHandler<GetMemberSpacesQuery, ISpaceDTO[]> {
  constructor(
    @injectSpaceService()
    private readonly service: ISpaceService,
  ) {}

  async execute(query: GetMemberSpacesQuery): Promise<ISpaceDTO[]> {
    return this.service.getMemberSpaces(query.userId)
  }
}
