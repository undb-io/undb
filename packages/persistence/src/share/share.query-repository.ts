import { inject, singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import type { IShareDTO, IShareQueryRepository, ShareSpecification } from "@undb/share"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { shareTable } from "../tables"
import { ShareFilterVisitor } from "./share.filter-visitor"
import { ShareMapper } from "./share.mapper"

@singleton()
export class ShareQueryRepository implements IShareQueryRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @inject(ShareMapper)
    private readonly mapper: ShareMapper,
  ) {}
  async findOneById(id: string): Promise<Option<IShareDTO>> {
    throw new Error("Method not implemented.")
  }

  async findOne(spec: ShareSpecification): Promise<Option<IShareDTO>> {
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

    return Some(this.mapper.toDTO(share))
  }
  async find(): Promise<IShareDTO[]> {
    throw new Error("Method not implemented.")
  }
}
