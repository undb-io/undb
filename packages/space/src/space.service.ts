import { inject, singleton } from "@undb/di"
import { None, Option, Some } from "oxide.ts"
import type { ISpaceSpecification } from "./interface"
import type { Space } from "./space.do"
import { SpaceFactory } from "./space.factory"
import { injectSpaceRepository, type ISpaceRepository } from "./space.repository"
import { WithSpaceBaseId, WithSpaceId } from "./specifications"

interface IGetSpaceInput {
  spaceId?: string
  baseId?: string
}

export interface ISpaceService {
  createPersonalSpace(): Promise<Space>
  getSpace(input: IGetSpaceInput): Promise<Option<Space>>
}

export const SPACE_SERVICE = Symbol.for("SPACE_SERVICE")
export const injectSpaceService = () => inject(SPACE_SERVICE)

@singleton()
export class SpaceService implements ISpaceService {
  constructor(
    @injectSpaceRepository()
    private readonly spaceRepository: ISpaceRepository,
  ) {}
  async createPersonalSpace(): Promise<Space> {
    const space = SpaceFactory.create({
      name: "",
      isPersonal: true,
    })

    await this.spaceRepository.insert(space)

    return space
  }
  async getSpace(input: IGetSpaceInput): Promise<Option<Space>> {
    let spec: Option<ISpaceSpecification> = None

    if (input.spaceId) {
      spec = Some(WithSpaceId.fromString(input.spaceId))
    } else if (input.baseId) {
      spec = Some(new WithSpaceBaseId(input.baseId))
    }

    if (spec.isNone()) {
      return None
    }
    const space = await this.spaceRepository.findOne(spec.unwrap())

    return space
  }
}
