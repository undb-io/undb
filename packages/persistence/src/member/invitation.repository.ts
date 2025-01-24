import type { IInvitationRepository, InvitationCompositeSpecification, InvitationDo } from "@undb/authz"
import { injectContext, type IContext } from "@undb/context"
import { inject, singleton } from "@undb/di"
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"
import { DbProviderService, type IDbProvider } from "../db.provider"
import { InvitationMutationVisitor } from "./invitation.mutation-visitor"

@singleton()
export class InvitationRepository implements IInvitationRepository {
  constructor(
    @injectContext()
    private readonly context: IContext,
    @injectTxCTX()
    private readonly txContext: ITxContext,
    @inject(DbProviderService)
    private readonly dbProvider: IDbProvider,
  ) {}
  async deleteOneById(id: string): Promise<void> {
    const trx = this.txContext.getCurrentTransaction()

    await trx.deleteFrom("undb_invitation").where("id", "=", id).execute()
  }

  async updateOneById(id: string, spec: InvitationCompositeSpecification): Promise<void> {
    const trx = this.txContext.getCurrentTransaction()

    await trx
      .updateTable("undb_invitation")
      .set((eb) => {
        const visitor = new InvitationMutationVisitor()
        spec.accept(visitor)
        return visitor.data
      })
      .where("id", "=", id)
      .execute()
  }

  async upsert(invitation: InvitationDo): Promise<void> {
    const trx = this.txContext.getCurrentTransaction()

    await trx
      .insertInto("undb_invitation")
      .values({
        id: invitation.id.value,
        email: invitation.email,
        space_id: this.context.mustGetCurrentSpaceId(),
        role: invitation.role,
        status: invitation.status,
        invited_at: invitation.invitedAt.getTime(),
        inviter_id: invitation.inviterId,
      })
      .$if(this.dbProvider.isMysql(), (eb) =>
        eb.onDuplicateKeyUpdate({
          invited_at: new Date(),
          status: invitation.status,
          role: invitation.role,
        }),
      )
      .$if(!this.dbProvider.isMysql(), (eb) =>
        eb.onConflict((oc) =>
          oc.columns(["id", "email"]).doUpdateSet({
            invited_at: new Date(),
            status: invitation.status,
            role: invitation.role,
          }),
        ),
      )
      .execute()
  }

  async insert(invitation: InvitationDo): Promise<void> {
    const trx = this.txContext.getCurrentTransaction()

    await trx
      .insertInto("undb_invitation")
      .values({
        id: invitation.id.value,
        email: invitation.email,
        space_id: this.context.mustGetCurrentSpaceId(),
        role: invitation.role,
        status: invitation.status,
        invited_at: invitation.invitedAt.getTime(),
        inviter_id: invitation.inviterId,
      })
      .execute()
  }
}
