import { singleton } from "@undb/di"
import type { IUser, IUserRepository } from "@undb/user"
import { getCurrentTransaction } from "../ctx"

@singleton()
export class UserRepository implements IUserRepository {
  insert(user: IUser): Promise<void> {
    throw new Error("Method not implemented.")
  }
  async updateOneById(userId: string, user: IUser): Promise<void> {
    const trx = getCurrentTransaction()
    await trx.updateTable("undb_user").set({ username: user.username }).where("id", "=", userId).execute()
  }
}
