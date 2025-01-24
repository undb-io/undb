import { SpaceMember, SpaceMemberComositeSpecification, type ISpaceMemberRepository } from "@undb/authz"
import { inject, singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"
import { DbProviderService, type IDbProvider } from "../db.provider"
import { injectQueryBuilder } from "../qb.provider"
import type { IQueryBuilder } from "../qb.type"
import { SpaceMemberFilterVisitor } from "./space-member.filter-visitor"

@singleton()
export class SpaceMemberRepository implements ISpaceMemberRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @injectTxCTX()
    private readonly txContext: ITxContext,
    @inject(DbProviderService)
    private readonly dbProvider: IDbProvider,
  ) {}

  async exists(spec: SpaceMemberComositeSpecification): Promise<boolean> {
    const user = await this.txContext
      .getCurrentTransaction()
      .selectFrom("undb_space_member")
      .selectAll()
      .where((eb) => {
        const visitor = new SpaceMemberFilterVisitor(this.qb, eb)
        spec.accept(visitor)

        return visitor.cond
      })
      .executeTakeFirst()
    return !!user
  }

  async findOne(spec: SpaceMemberComositeSpecification): Promise<Option<SpaceMember>> {
    const member = await this.txContext
      .getCurrentTransaction()
      .selectFrom("undb_space_member")
      .selectAll()
      .where((eb) => {
        const visitor = new SpaceMemberFilterVisitor(this.qb, eb)
        spec.accept(visitor)

        return visitor.cond
      })
      .executeTakeFirst()

    if (!member) {
      return None
    }

    return Some(
      new SpaceMember({
        id: member.id,
        role: member.role,
        userId: member.user_id,
        spaceId: member.space_id,
      }),
    )
  }
  findOneById(id: string): Promise<SpaceMember> {
    throw new Error("Method not implemented.")
  }
  async insert(member: SpaceMember): Promise<void> {
    const json = member.toJSON()
    await this.txContext
      .getCurrentTransaction()
      .insertInto("undb_space_member")
      .values({
        id: json.id,
        role: json.role,
        space_id: json.spaceId,
        user_id: json.userId,
      })
      .$if(this.dbProvider.isMysql(), (eb) => eb.ignore())
      .$if(!this.dbProvider.isMysql(), (eb) => eb.onConflict((c) => c.doNothing()))
      .execute()
  }
}
