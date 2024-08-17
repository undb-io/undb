import { BaseId, injectBaseRepository, WithBaseId, WithBaseSpaceId, type IBaseRepository } from "@undb/base"
import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { IQueryHandler } from "@undb/domain"
import { GetTemplateQuery, type IGetTemplateOutput, type IGetTemplateQuery } from "@undb/queries"

@queryHandler(GetTemplateQuery)
@singleton()
export class GetTemplateQueryHandler implements IQueryHandler<IGetTemplateQuery, IGetTemplateOutput> {
  constructor(
    @injectBaseRepository()
    private readonly baseRepo: IBaseRepository,
  ) {}

  async execute({ spaceId, baseId }: IGetTemplateQuery): Promise<IGetTemplateOutput> {
    const base = (
      await this.baseRepo.findOne(new WithBaseId(new BaseId(baseId)).and(new WithBaseSpaceId(spaceId)))
    ).expect("base not found")

    return {
      baseId: base.id.value,
      spaceId: base.spaceId,
      name: base.name.value,
    }
  }
}
