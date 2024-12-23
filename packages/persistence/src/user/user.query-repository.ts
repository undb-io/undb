import { singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import type { IUser, IUserQueryRepository } from "@undb/user"
import { injectQueryBuilder } from "../qb.provider"
import type { IQueryBuilder } from "../qb.type"

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
      password: user.password,
    })
  }

  async findOneByEmail(email: string): Promise<Option<IUser>> {
    const user = await this.qb
      .selectFrom("undb_user")
      .selectAll()
      .where((eb) => eb.eb("undb_user.email", "=", email))
      .executeTakeFirst()

    if (!user) {
      return None
    }
    return Some({
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password,
    })
  }
}
