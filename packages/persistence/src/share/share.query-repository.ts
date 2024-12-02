import { inject, singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import type { IShareDTO, IShareQueryRepository, ShareSpecification } from "@undb/share"
import { injectQueryBuilder } from "../qb.provider"
import type { IQueryBuilder } from "../qb.type"
import { ShareFilterVisitor } from "./share.filter-visitor"
import { ShareMapper } from "./share.mapper"

@singleton()
export class ShareQueryRepository implements IShareQueryRepository {
  constructor(
    @inject(ShareMapper)
    private readonly mapper: ShareMapper,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}
  async findOneById(id: string): Promise<Option<IShareDTO>> {
    throw new Error("Method not implemented.")
  }

  async findOne(spec: ShareSpecification): Promise<Option<IShareDTO>> {
    const share = await this.qb
      .selectFrom("undb_share")
      .selectAll()
      .where((eb) => {
        const visitor = new ShareFilterVisitor(eb)
        spec.accept(visitor)
        return visitor.cond
      })
      .executeTakeFirst()

    if (!share) {
      return None
    }

    return Some(this.mapper.toDTO(share))
  }
  async find(): Promise<IShareDTO[]> {
    throw new Error("Method not implemented.")
  }
}
