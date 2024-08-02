import { inject } from "@undb/di"
import { Option } from "@undb/domain"
import type { ISpaceDTO } from "./dto/space.dto.js"
import type { ISpaceSpecification } from "./interface"
import type { Space } from "./space.do.js"

export interface ISpaceRepository {
  find(spec: ISpaceSpecification): Promise<Space[]>
  findOne(spec: ISpaceSpecification): Promise<Option<Space>>
  findOneById(id: string): Promise<Option<Space>>

  insert(space: Space): Promise<void>
  updateOneById(space: Space, spec: ISpaceSpecification): Promise<void>
  deleteOneById(id: string): Promise<void>
}

export const SPACE_REPOSITORY = Symbol.for("ISpaceRepository")
export const injectSpaceRepository = () => inject(SPACE_REPOSITORY)

export interface ISpaceQueryRepository {
  find(spec: Option<ISpaceSpecification>): Promise<ISpaceDTO[]>
  findOneById(id: string): Promise<Option<ISpaceDTO>>
}

export const SPACE_QUERY_REPOSITORY = Symbol.for("ISpaceQueryRepository")
export const injectSpaceQueryRepository = () => inject(SPACE_QUERY_REPOSITORY)
