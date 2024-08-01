import { WorkspaceMember, type IWorkspaceMemberRepository } from "@undb/authz"
import { singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"

@singleton()
export class WorkspaceMemberRepository implements IWorkspaceMemberRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  async exists(email: string): Promise<boolean> {
    const user = await this.qb
      .selectFrom("undb_user")
      .selectAll()
      .where((eb) => eb.eb("undb_user.email", "=", email))
      .executeTakeFirst()
    return !!user
  }
  async findOneByUserId(userId: string): Promise<Option<WorkspaceMember>> {
    const member = await this.qb
      .selectFrom("undb_workspace_member")
      .selectAll()
      .where((eb) => eb.eb("undb_workspace_member.user_id", "=", userId))
      .executeTakeFirst()

    if (!member) {
      return None
    }

    return Some(
      new WorkspaceMember({
        id: member.id,
        role: member.role,
        userId: member.user_id,
      }),
    )
  }
  findOneById(id: string): Promise<WorkspaceMember> {
    throw new Error("Method not implemented.")
  }
  async insert(member: WorkspaceMember): Promise<void> {
    const json = member.toJSON()
    await this.qb
      .insertInto("undb_workspace_member")
      .values({
        id: json.id,
        role: json.role,
        user_id: json.userId,
      })
      .execute()
  }
}
