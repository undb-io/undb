import { WithBaseId, type IBaseDTO, type IBaseQueryRepository, type IBaseSpecification } from "@undb/base"
import { inject, singleton } from "@undb/di"
import { None, Some, type IUnitOfWork, type Option } from "@undb/domain"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { baseTable } from "../tables"
import { injectDbUnitOfWork } from "../uow"
import { BaseFilterVisitor } from "./base.filter-visitor"
import { BaseMapper } from "./base.mapper"

@singleton()
export class BaseQueryRepository implements IBaseQueryRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @inject(BaseMapper)
    private readonly mapper: BaseMapper,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
  ) {}

  async find(spec: Option<IBaseSpecification>): Promise<IBaseDTO[]> {
    const qb = this.db.select().from(baseTable).$dynamic()

    const visitor = new BaseFilterVisitor()
    if (spec.isSome()) {
      spec.unwrap().accept(visitor)
    }

    const bases = await qb.where(visitor.cond)

    return bases.map((b) => this.mapper.toDTO(b))
  }

  async findOneById(id: string): Promise<Option<IBaseDTO>> {
    const qb = this.db.select().from(baseTable).$dynamic()

    const spec = WithBaseId.fromString(id)
    const visitor = new BaseFilterVisitor()
    spec.accept(visitor)

    const base = await qb.where(visitor.cond).limit(1)

    return base.length ? Some(this.mapper.toDTO(base[0])) : None
  }
}
