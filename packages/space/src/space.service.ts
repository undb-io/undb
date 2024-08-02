import { inject, singleton } from "@undb/di"
import type { Space } from "./space.do"
import { SpaceFactory } from "./space.factory"
import { injectSpaceRepository, type ISpaceRepository } from "./space.repository"

export interface ISpaceService {
  createPersonalSpace(): Promise<Space>
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
}
