import { getCurrentUserId } from "@undb/context/server"
import { singleton } from "@undb/di"
import type { Option } from "@undb/domain"
import type { ISpaceRepository, Space } from "@undb/space"
import type { ISpaceSpecification } from "@undb/space/src/interface"
import { getCurrentTransaction } from "../ctx"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"

@singleton()
export class SpaceRepostitory implements ISpaceRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}
  find(spec: ISpaceSpecification): Promise<Space[]> {
    throw new Error("Method not implemented.")
  }
  findOne(spec: ISpaceSpecification): Promise<Option<Space>> {
    throw new Error("Method not implemented.")
  }
  findOneById(id: string): Promise<Option<Space>> {
    throw new Error("Method not implemented.")
  }
  async insert(space: Space): Promise<void> {
    const tx = getCurrentTransaction()
    const userId = getCurrentUserId()
    await tx
      .insertInto("undb_space")
      .values({
        id: space.id.value,
        name: space.name.value,
        created_by: userId,
        updated_by: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .execute()
  }
  updateOneById(space: Space, spec: ISpaceSpecification): Promise<void> {
    throw new Error("Method not implemented.")
  }
  deleteOneById(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
