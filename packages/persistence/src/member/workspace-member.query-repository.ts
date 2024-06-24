import { type IWorkspaceMemberDTO, type IWorkspaceMemberQueryRepository } from "@undb/authz"
import { inject, singleton } from "@undb/di"
import { None, Option, Some, type IUnitOfWork } from "@undb/domain"
import type { IUser } from "@undb/user"
import { eq } from "drizzle-orm"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { users, workspaceMember } from "../tables"
import { injectDbUnitOfWork } from "../uow/db.unit-of-work.provider"
import { MemberMapper } from "./member.mapper"

@singleton()
export class WorkspaceMemberQueryRepository implements IWorkspaceMemberQueryRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
    @inject(MemberMapper)
    private readonly mapper: MemberMapper,
  ) {}

  async findUserByMemberId(memberId: string): Promise<Option<IUser>> {
    const results = await this.db
      .select()
      .from(workspaceMember)
      .leftJoin(users, eq(workspaceMember.userId, users.id))
      .where(eq(workspaceMember.id, memberId))
      .limit(1)
      .execute()

    if (results.length === 0) {
      return None
    }

    const [{ user }] = results
    if (!user) {
      return None
    }

    return Some({ id: user.id, email: user.email, username: user.username })
  }

  async find(): Promise<IWorkspaceMemberDTO[]> {
    const members = await this.db.select().from(workspaceMember)

    return members.map((m) => this.mapper.toDTO(m))
  }
}
