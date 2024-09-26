import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { None, type IQueryHandler } from "@undb/domain"
import { GetTemplatesQuery } from "@undb/queries"
import { injectTemplateQueryRepository, type ITemplateDTO, type ITemplateQueryRepository } from "@undb/template"

@queryHandler(GetTemplatesQuery)
@singleton()
export class GetTemplatesQueryHandler implements IQueryHandler<GetTemplatesQuery, any> {
  constructor(
    @injectTemplateQueryRepository()
    private readonly repo: ITemplateQueryRepository,
  ) {}

  async execute(query: GetTemplatesQuery): Promise<ITemplateDTO[]> {
    return this.repo.find(None)
  }
}
