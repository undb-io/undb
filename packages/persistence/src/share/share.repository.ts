import { inject, singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import { WithShareId, type IShareRepository, type Share, type ShareSpecification } from "@undb/share"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { shareTable } from "../tables"
import { ShareFilterVisitor } from "./share.filter-visitor"
import { ShareMapper } from "./share.mapper"

@singleton()
export class ShareRepository implements IShareRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @inject(ShareMapper)
    private readonly mapper: ShareMapper,
  ) {}
  insert(share: Share): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async updateOneById(share: Share, spec: ShareSpecification): Promise<void> {
    const entity = this.mapper.toEntity(share)
    await this.db
      .insert(shareTable)
      .values(entity)
      .onConflictDoUpdate({
        target: [shareTable.targetId, shareTable.targetType],
        set: { enabled: share.enabled },
      })
  }
  async findOneById(id: string): Promise<Option<Share>> {
    const qb = this.db.select().from(shareTable).$dynamic()
    const visitor = new ShareFilterVisitor()

    const spec = WithShareId.fromString(id)
    spec.accept(visitor)

    const results = await qb.where(visitor.cond).limit(1)
    if (results.length === 0) {
      return None
    }

    const [share] = results
    if (!share) {
      return None
    }

    return Some(this.mapper.toDo(share))
  }
  async findOne(spec: ShareSpecification): Promise<Option<Share>> {
    const qb = this.db.select().from(shareTable).$dynamic()
    const visitor = new ShareFilterVisitor()
    spec.accept(visitor)

    const results = await qb.where(visitor.cond).limit(1)
    if (results.length === 0) {
      return None
    }

    const [share] = results
    if (!share) {
      return None
    }

    return Some(this.mapper.toDo(share))
  }
  find(spec: ShareSpecification): Promise<Share[]> {
    throw new Error("Method not implemented.")
  }
  deleteOneById(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
