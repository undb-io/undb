import { singleton } from "@undb/di"
import { None, Some, type Option } from "@undb/domain"
import type { ISpaceDTO, ISpaceQueryRepository, ISpaceSpecification } from "@undb/space"
import type { IQueryBuilder } from "../qb"
import { injectQueryBuilder } from "../qb.provider"

@singleton()
export class SpaceQueryRepository implements ISpaceQueryRepository {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}
  find(spec: Option<ISpaceSpecification>): Promise<ISpaceDTO[]> {
    throw new Error("Method not implemented.")
  }
  async findOneById(id: string): Promise<Option<ISpaceDTO>> {
    const space = await this.qb.selectFrom("undb_space").selectAll().where("undb_space.id", "=", id).executeTakeFirst()

    if (!space) {
      return None
    }

    return Some({
      id: space.id,
      name: space.name ?? "",
      isPersonal: Boolean(space.is_personal),
    })
  }
}
