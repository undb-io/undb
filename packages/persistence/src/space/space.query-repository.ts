import { singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import type { ISpaceDTO, ISpaceQueryRepository, ISpaceSpecification } from "@undb/space"
import { injectQueryBuilder } from "../qb.provider"
import type { IQueryBuilder } from "../qb.type"
import { SpaceFilterVisitor } from "./space.filter-visitor"

@singleton()
export class SpaceQueryRepository implements ISpaceQueryRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}
  async find(spec: Option<ISpaceSpecification>): Promise<ISpaceDTO[]> {
    const spaces = await this.qb
      .selectFrom("undb_space")
      .selectAll()
      .where((eb) => {
        const visitor = new SpaceFilterVisitor(this.qb, eb)
        if (spec.isSome()) {
          spec.unwrap().accept(visitor)
        }
        return visitor.cond
      })
      .execute()
    return spaces.map((space) => ({
      id: space.id,
      name: space.name ?? "",
      isPersonal: Boolean(space.is_personal),
      avatar: space.avatar,
    }))
  }
  async findOneById(id: string): Promise<Option<ISpaceDTO>> {
    const space = await this.qb.selectFrom("undb_space").selectAll().where("undb_space.id", "=", id).executeTakeFirst()

    if (!space) {
      return None
    }

    return Some({
      id: space.id,
      avatar: space.avatar,
      name: space.name ?? "",
      isPersonal: Boolean(space.is_personal),
    })
  }
}
