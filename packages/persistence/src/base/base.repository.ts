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
import { None, Some, type Option } from "@undb/domain"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { BaseFilterVisitor } from "./base.filter-visitor"
import { BaseMapper } from "./base.mapper"
import { BaseMutateVisitor } from "./base.mutate-visitor"

@singleton()
export class BaseRepository implements IBaseRepository {
  constructor(
    @inject(BaseMapper)
    private readonly mapper: BaseMapper,
    @injectBaseOutboxService()
    private readonly outboxService: IBaseOutboxService,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  find(spec: IBaseSpecification): Promise<Base[]> {
    throw new Error("Method not implemented.")
  }
  async findOne(spec: IBaseSpecification): Promise<Option<Base>> {
    const base = await this.qb
      .selectFrom("undb_base")
      .selectAll()
      .where((eb) => {
        const visitor = new BaseFilterVisitor(eb)
        spec.accept(visitor)
        return visitor.cond
      })
      .executeTakeFirst()

    return base ? Some(this.mapper.toDo(base)) : None
  }
  async findOneById(id: string): Promise<Option<Base>> {
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

    return base ? Some(this.mapper.toDo(base)) : None
  }
  async insert(base: Base): Promise<void> {
    const user = executionContext.getStore()?.user?.userId!
    const values = this.mapper.toEntity(base)

    await this.qb
      .insertInto("undb_base")
      .values({
        ...values,
        created_by: user,
        updated_by: user,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .execute()
    await this.outboxService.save(base)
  }
  async updateOneById(base: Base, spec: IBaseSpecification): Promise<void> {
    const ctx = executionContext.getStore()
    const userId = ctx!.user!.userId!

    const visitor = new BaseMutateVisitor()
    spec.accept(visitor)

    await this.qb
      .updateTable("undb_base")
      .set({ ...visitor.data, updated_by: userId, updated_at: new Date().toISOString() })
      .where((eb) => eb.eb("id", "=", base.id.value))
      .execute()
    await this.outboxService.save(base)
  }

  deleteOneById(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
