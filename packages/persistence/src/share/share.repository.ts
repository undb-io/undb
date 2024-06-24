import { inject, singleton } from "@undb/di"
import type { Option } from "@undb/domain"
import type { IShareRepository, Share, ShareSpecification } from "@undb/share"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { shareTable } from "../tables"
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
      .onConflictDoUpdate({ target: [shareTable.targetId, shareTable.targetType], set: { enabled: share.enabled } })
  }
  findOneById(id: string): Promise<Option<Share>> {
    throw new Error("Method not implemented.")
  }
  findOne(spec: ShareSpecification): Promise<Option<Share>> {
    throw new Error("Method not implemented.")
  }
  find(spec: ShareSpecification): Promise<Share[]> {
    throw new Error("Method not implemented.")
  }
  deleteOneById(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
