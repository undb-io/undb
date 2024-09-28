import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type IQueryHandler } from "@undb/domain"
import { GetTemplateQuery } from "@undb/queries"
import { injectTemplateQueryRepository, type ITemplateDTO, type ITemplateQueryRepository } from "@undb/template"

@queryHandler(GetTemplateQuery)
@singleton()
export class GetTemplateQueryHandler implements IQueryHandler<GetTemplateQuery, any> {
  constructor(
    @injectTemplateQueryRepository()
    private readonly repo: ITemplateQueryRepository,
  ) {}

  async execute(query: GetTemplateQuery): Promise<ITemplateDTO> {
    return (await this.repo.findOneById(query.id)).expect("template not found")
  }
}
