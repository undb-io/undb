import { WorkspaceMember, type IWorkspaceMemberRepository } from "@undb/authz"
import { singleton } from "@undb/di"
import { None, Some, type IUnitOfWork, type Option } from "@undb/domain"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { injectDbUnitOfWork } from "../uow/db.unit-of-work.provider"

@singleton()
export class WorkspaceMemberRepository implements IWorkspaceMemberRepository {
  constructor(
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}
  async findOneByUserIdAndWorkspaceId(userId: string, workspaceId: string): Promise<Option<WorkspaceMember>> {
    const member = await this.qb
      .selectFrom("undb_workspace_member")
      .selectAll()
      .where((eb) =>
        eb.and([
          eb.eb("undb_workspace_member.user_id", "=", userId),
          eb.eb("undb_workspace_member.workspace_id", "=", workspaceId),
        ]),
      )
      .executeTakeFirst()

    if (!member) {
      return None
    }

    return Some(
      new WorkspaceMember({
        id: member.id,
        role: member.role,
        userId: member.user_id,
        workspaceId: member.workspace_id,
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
        workspace_id: json.workspaceId,
      })
      .execute()
  }
}
