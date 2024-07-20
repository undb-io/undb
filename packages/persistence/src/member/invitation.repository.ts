import type { IInvitationRepository, InvitationDo } from "@undb/authz"
import { singleton } from "@undb/di"
import { getCurrentTransaction } from "../ctx"

@singleton()
export class InvitationRepository implements IInvitationRepository {
  async deleteOneById(id: string): Promise<void> {
    const trx = getCurrentTransaction()

    await trx.deleteFrom("undb_invitation").where("id", "=", id).execute()
  }
  async insert(invitation: InvitationDo): Promise<void> {
    const trx = getCurrentTransaction()

    await trx
      .insertInto("undb_invitation")
      .values({
        id: invitation.id.value,
        email: invitation.email,
        role: invitation.role,
        status: invitation.status,
      })
      .execute()
  }
}
