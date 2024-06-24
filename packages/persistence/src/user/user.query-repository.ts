import { singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import type { IUser, IUserQueryRepository } from "@undb/user"
import { eq } from "drizzle-orm"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { users } from "../tables"

@singleton()
export class UserQueryRepository implements IUserQueryRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
  ) {}

  async findOneById(userId: string): Promise<Option<IUser>> {
    const results = await this.db.select().from(users).where(eq(users.id, userId)).limit(1)
    if (results.length === 0) {
      return None
    }
    const result = results[0]
    if (!result) {
      return None
    }
    return Some({
      id: result.id,
      email: result.email,
      username: result.username,
    })
  }
}
