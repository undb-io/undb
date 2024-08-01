import { singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import type { IUser, IUserQueryRepository } from "@undb/user"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"

@singleton()
export class UserQueryRepository implements IUserQueryRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  async findOneById(userId: string): Promise<Option<IUser>> {
    const user = await this.qb
      .selectFrom("undb_user")
      .selectAll()
      .where((eb) => eb.eb("undb_user.id", "=", userId))
      .executeTakeFirst()

    if (!user) {
      return None
    }
    return Some({
      id: user.id,
      email: user.email,
      username: user.username,
    })
  }
}
