import { getCurrentUserId } from "@undb/context/server"
import { singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import { SpaceFactory, type ISpaceRepository, type ISpaceSpecification, type Space } from "@undb/space"
import { getCurrentTransaction } from "../ctx"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"
import { SpaceFilterVisitor } from "./space.filter-visitor"

@singleton()
export class SpaceRepostitory implements ISpaceRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}
  find(spec: ISpaceSpecification): Promise<Space[]> {
    throw new Error("Method not implemented.")
  }
  async findOne(spec: ISpaceSpecification): Promise<Option<Space>> {
    const space = await this.qb
      .selectFrom("undb_space")
      .selectAll()
      .where((eb) => {
        const visitor = new SpaceFilterVisitor(this.qb, eb)
        spec.accept(visitor)
        return visitor.cond
      })
      .executeTakeFirst()

    if (!space) {
      return None
    }

    return Some(
      SpaceFactory.fromJSON({
        id: space.id,
        name: space.name ?? "",
        avatar: space.avatar,
        isPersonal: Boolean(space.is_personal),
      }),
    )
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
        avatar: space.avatar.into(undefined)?.value ?? null,
        is_personal: space.isPersonal,
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
