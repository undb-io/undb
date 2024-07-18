import { type IWorkspaceMemberDTO, type IWorkspaceMemberQueryRepository } from "@undb/authz"
import type { WorkspaceMemberComositeSpecification } from "@undb/authz/src/workspace-member/workspace-member.composite-specification"
import { inject, singleton } from "@undb/di"
import { None, Option, Some, type IUnitOfWork } from "@undb/domain"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { injectDbUnitOfWork } from "../uow/db.unit-of-work.provider"
import { MemberMapper } from "./member.mapper"
import { WorkspaceMemberFilterVisitor } from "./workspace-member.filter-visitor"

@singleton()
export class WorkspaceMemberQueryRepository implements IWorkspaceMemberQueryRepository {
  constructor(
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
    @inject(MemberMapper)
    private readonly mapper: MemberMapper,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  async findOneById(id: string): Promise<Option<IWorkspaceMemberDTO>> {
    const member = await this.qb
      .selectFrom("undb_workspace_member")
      .selectAll()
      .leftJoin("undb_user", "undb_user.id", "undb_workspace_member.user_id")
      .where((eb) => eb.eb("undb_user.id", "=", id))
      .executeTakeFirst()

    if (!member) {
      return None
    }

    return Some(this.mapper.toDTO(member))
  }

  async findByIds(ids: [string, ...string[]]): Promise<IWorkspaceMemberDTO[]> {
    const members = await this.qb
      .selectFrom("undb_workspace_member")
      .selectAll()
      .leftJoin("undb_user", "undb_user.id", "undb_workspace_member.user_id")
      .where((eb) => eb.eb("undb_user.id", "in", ids))
      .execute()

    return members.map((m) => this.mapper.toDTO(m))
  }

  async find(spec: Option<WorkspaceMemberComositeSpecification>): Promise<IWorkspaceMemberDTO[]> {
    const members = await this.qb
      .selectFrom("undb_workspace_member")
      .selectAll()
      .leftJoin("undb_user", "undb_user.id", "undb_workspace_member.user_id")
      .where((eb) => {
        const visitor = new WorkspaceMemberFilterVisitor(eb)

        if (spec.isSome()) {
          spec.unwrap().accept(visitor)
        }
        return visitor.cond
      })
      .execute()

    return members.map((m) => this.mapper.toDTO(m))
  }
}
