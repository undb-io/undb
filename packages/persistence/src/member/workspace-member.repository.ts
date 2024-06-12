import type { IWorkspaceMemberRepository, WorkspaceMember } from "@undb/authz"
import { singleton } from "@undb/di"
import { injectDb } from "../db.provider"
import type { Database } from "../db"
import { injectDbUnitOfWork } from "../uow/db.unit-of-work.provider"
import type { IUnitOfWork } from "@undb/domain"
import { workspaceMember } from "../tables"

@singleton()
export class WorkspaceMemberRepository implements IWorkspaceMemberRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
  ) {}
  findOneById(id: string): Promise<WorkspaceMember> {
    throw new Error("Method not implemented.")
  }
  findOneByUserId(userId: string): Promise<WorkspaceMember> {
    throw new Error("Method not implemented.")
  }
  async insert(member: WorkspaceMember): Promise<void> {
    await this.db.insert(workspaceMember).values(member.toJSON())
  }
}
