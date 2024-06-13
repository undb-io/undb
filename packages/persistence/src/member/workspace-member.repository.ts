import { WorkspaceMember, type IWorkspaceMemberRepository } from "@undb/authz"
import { singleton } from "@undb/di"
import { None, Some, type IUnitOfWork, type Option } from "@undb/domain"
import { and, eq } from "drizzle-orm"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { workspaceMember } from "../tables"
import { injectDbUnitOfWork } from "../uow/db.unit-of-work.provider"

@singleton()
export class WorkspaceMemberRepository implements IWorkspaceMemberRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
  ) {}
  async findOneByUserIdAndWorkspaceId(userId: string, workspaceId: string): Promise<Option<WorkspaceMember>> {
    const members = await this.db
      .select()
      .from(workspaceMember)
      .where(and(eq(workspaceMember.userId, userId), eq(workspaceMember.workspaceId, workspaceId)))
      .limit(1)
      .execute()

    if (members.length === 0) {
      return None
    }

    const member = members[0]

    return Some(
      new WorkspaceMember({
        id: member.id,
        role: member.role,
        userId: member.userId,
        workspaceId: member.workspaceId,
      }),
    )
  }
  findOneById(id: string): Promise<WorkspaceMember> {
    throw new Error("Method not implemented.")
  }
  async insert(member: WorkspaceMember): Promise<void> {
    await this.db.insert(workspaceMember).values(member.toJSON())
  }
}
