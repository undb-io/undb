import {
  WithBaseId,
  injectBaseOutboxService,
  type Base,
  type IBaseOutboxService,
  type IBaseRepository,
  type IBaseSpecification,
} from "@undb/base"
import { executionContext } from "@undb/context/server"
import { inject, singleton } from "@undb/di"
import { None, Some, type IUnitOfWork, type Option } from "@undb/domain"
import { eq } from "drizzle-orm"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { baseTable } from "../tables"
import { injectDbUnitOfWork } from "../uow"
import { BaseFilterVisitor } from "./base.filter-visitor"
import { BaseMapper } from "./base.mapper"
import { BaseMutateVisitor } from "./base.mutate-visitor"

@singleton()
export class BaseRepository implements IBaseRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @inject(BaseMapper)
    private readonly mapper: BaseMapper,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
    @injectBaseOutboxService()
    private readonly outboxService: IBaseOutboxService,
  ) {}

  find(spec: IBaseSpecification): Promise<Base[]> {
    throw new Error("Method not implemented.")
  }
  async findOneById(id: string): Promise<Option<Base>> {
    const qb = this.db.select().from(baseTable).$dynamic()

    const spec = WithBaseId.fromString(id)
    const visitor = new BaseFilterVisitor()
    spec.accept(visitor)

    const base = await qb.where(visitor.cond).limit(1)

    return base.length ? Some(this.mapper.toDo(base[0])) : None
  }
  async insert(base: Base): Promise<void> {
    const user = executionContext.getStore()?.user?.userId!
    const values = this.mapper.toEntity(base)

    await this.db.insert(baseTable).values({ ...values, createdBy: user, updatedBy: user })
    await this.outboxService.save(base)
  }
  async updateOneById(base: Base, spec: IBaseSpecification): Promise<void> {
    const ctx = executionContext.getStore()
    const userId = ctx!.user!.userId!

    const visitor = new BaseMutateVisitor()
    spec.accept(visitor)

    await this.db
      .update(baseTable)
      .set({ ...visitor.updates, updatedBy: userId })
      .where(eq(baseTable.id, base.id.value))
    await this.outboxService.save(base)
  }
  deleteOneById(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
