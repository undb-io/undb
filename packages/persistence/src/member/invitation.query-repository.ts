import type { IInvitationQueryRepository, InvitationDTO } from "@undb/authz"
import { singleton } from "@undb/di"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"

@singleton()
export class InvitationQueryRepository implements IInvitationQueryRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}
  async find(): Promise<InvitationDTO[]> {
    const invitations = await this.qb.selectFrom("undb_invitation").selectAll().execute()

    return invitations.map((i) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      status: i.status,
    }))
  }
}
