import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { None, type IQueryHandler } from "@undb/domain"
import { GetTemplatesQuery, type IGetTemplatesQueryOutput } from "@undb/queries"
import { injectTemplateQueryRepository, type ITemplateQueryRepository } from "@undb/template"

@queryHandler(GetTemplatesQuery)
@singleton()
export class GetTemplatesQueryHandler implements IQueryHandler<GetTemplatesQuery, IGetTemplatesQueryOutput> {
  constructor(
    @injectTemplateQueryRepository()
    private readonly repo: ITemplateQueryRepository,
  ) {}

  async execute(query: GetTemplatesQuery): Promise<IGetTemplatesQueryOutput> {
    return this.repo.find(None)
  }
}
