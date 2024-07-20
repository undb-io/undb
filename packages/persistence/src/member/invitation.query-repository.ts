import type { IInvitationQueryRepository, InvitationCompositeSpecification, InvitationDTO } from "@undb/authz"
import { singleton } from "@undb/di"
import type { Option } from "@undb/domain"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { InvitationFilterVisitor } from "./invitation.filter-visitor"

@singleton()
export class InvitationQueryRepository implements IInvitationQueryRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}
  async find(spec: Option<InvitationCompositeSpecification>): Promise<InvitationDTO[]> {
    const invitations = await this.qb
      .selectFrom("undb_invitation")
      .selectAll()
      .where((eb) => {
        const visitor = new InvitationFilterVisitor(eb)
        if (spec.isSome()) {
          spec.unwrap().accept(visitor)
        }

        return visitor.cond
      })
      .execute()

    return invitations.map((i) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      status: i.status,
    }))
  }
}
