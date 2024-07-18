import { WithBaseId, type IBaseDTO, type IBaseQueryRepository, type IBaseSpecification } from "@undb/base"
import { inject, singleton } from "@undb/di"
import { None, Some, type IUnitOfWork, type Option } from "@undb/domain"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { injectDbUnitOfWork } from "../uow"
import { BaseFilterVisitor } from "./base.filter-visitor"
import { BaseMapper } from "./base.mapper"

@singleton()
export class BaseQueryRepository implements IBaseQueryRepository {
  constructor(
    @inject(BaseMapper)
    private readonly mapper: BaseMapper,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  async find(spec: Option<IBaseSpecification>): Promise<IBaseDTO[]> {
    const bases = await this.qb
      .selectFrom("undb_base")
      .selectAll()
      .where((eb) => {
        const visitor = new BaseFilterVisitor(eb)
        if (spec.isSome()) {
          spec.unwrap().accept(visitor)
        }
        return visitor.cond
      })
      .execute()

    return bases.map((b) => this.mapper.toDTO(b))
  }

  async findOneById(id: string): Promise<Option<IBaseDTO>> {
    const spec = WithBaseId.fromString(id)

    const base = await this.qb
      .selectFrom("undb_base")
      .selectAll()
      .where((eb) => {
        const visitor = new BaseFilterVisitor(eb)
        spec.accept(visitor)
        return visitor.cond
      })
      .executeTakeFirst()

    return base ? Some(this.mapper.toDTO(base)) : None
  }
}
