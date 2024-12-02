import { singleton } from "@undb/di"
import type { IUser, IUserRepository } from "@undb/user"
import type { ITxContext } from "../ctx.interface"
import { injectTxCTX } from "../ctx.provider"

@singleton()
export class UserRepository implements IUserRepository {
  constructor(
    @injectTxCTX()
    private readonly txContext: ITxContext,
  ) {}
  insert(user: IUser): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async updateOneById(userId: string, user: IUser): Promise<void> {
    const trx = this.txContext.getCurrentTransaction()
    await trx.updateTable("undb_user").set({ username: user.username }).where("id", "=", userId).execute()
  }
}
