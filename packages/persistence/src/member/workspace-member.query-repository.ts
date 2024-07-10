import { type IWorkspaceMemberDTO, type IWorkspaceMemberQueryRepository } from "@undb/authz"
import type { WorkspaceMemberComositeSpecification } from "@undb/authz/src/workspace-member/workspace-member.composite-specification"
import { inject, singleton } from "@undb/di"
import { None, Option, Some, type IUnitOfWork } from "@undb/domain"
import { eq, inArray } from "drizzle-orm"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { users, workspaceMember } from "../tables"
import { injectDbUnitOfWork } from "../uow/db.unit-of-work.provider"
import { MemberMapper } from "./member.mapper"
import { WorkspaceMemberFilterVisitor } from "./workspace-member.filter-visitor"

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

  async findOneById(id: string): Promise<Option<IWorkspaceMemberDTO>> {
    const members = await this.db
      .select()
      .from(workspaceMember)
      .leftJoin(users, eq(users.id, workspaceMember.userId))
      .where(eq(users.id, id))

    if (members.length === 0) {
      return None
    }

    return Some(this.mapper.toDTO(members[0].workspace_member))
  }

  async findByIds(ids: [string, ...string[]]): Promise<IWorkspaceMemberDTO[]> {
    const members = await this.db
      .select()
      .from(workspaceMember)
      .leftJoin(users, eq(users.id, workspaceMember.userId))
      .where(inArray(users.id, ids))

    return members.map((m) => this.mapper.toDTO(m.workspace_member))
  }

  async find(spec: Option<WorkspaceMemberComositeSpecification>): Promise<IWorkspaceMemberDTO[]> {
    const visitor = new WorkspaceMemberFilterVisitor()

    if (spec.isSome()) {
      spec.unwrap().accept(visitor)
    }

    const members = await this.db
      .select()
      .from(workspaceMember)
      .leftJoin(users, eq(users.id, workspaceMember.userId))
      .where(visitor.cond)

    return members.map((m) => this.mapper.toDTO(m.workspace_member))
  }
}
