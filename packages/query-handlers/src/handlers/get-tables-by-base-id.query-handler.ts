import { queryHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { Some, type IQueryHandler } from "@undb/domain"
import { GetTablesByBaseIdQuery } from "@undb/queries"
import {
  TableBaseIdSpecification,
  injectTableQueryRepository,
  type ITableDTO,
  type ITableQueryRepository,
} from "@undb/table"

@queryHandler(GetTablesByBaseIdQuery)
@singleton()
export class GetTablesByBaseIdQueryHandler implements IQueryHandler<GetTablesByBaseIdQuery, ITableDTO[]> {
  constructor(
    @injectTableQueryRepository()
    private readonly repo: ITableQueryRepository,
  ) {}

  async execute(query: GetTablesByBaseIdQuery): Promise<ITableDTO[]> {
    const spec = new TableBaseIdSpecification(query.baseId)
    const tables = await this.repo.find(Some(spec))

    return tables
  }
}
