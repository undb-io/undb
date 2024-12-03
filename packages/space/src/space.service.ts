import type { IContext } from "@undb/context"
import { inject, singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import { None, Option, Some } from "oxide.ts"
import { match, P } from "ts-pattern"
import type { ICreateSpaceDTO, ISpaceDTO } from "./dto"
import type { ISpaceSpecification } from "./interface"
import type { Space } from "./space.do"
import { SpaceFactory } from "./space.factory"
import {
  injectSpaceQueryRepository,
  injectSpaceRepository,
  type ISpaceQueryRepository,
  type ISpaceRepository,
} from "./space.repository"
import { WithSpaceApiToken, WithSpaceBaseId, WithSpaceId, WithSpaceShareId, WithSpaceTableId } from "./specifications"
import { WithSpaceUserId } from "./specifications/space-user-id.specification"

interface IGetSpaceInput {
  spaceId?: string
  baseId?: string
  tableId?: string
  apiToken?: string
  shareId?: string
  userId?: string
}

export interface ISpaceService {
  createSpace(dto: ICreateSpaceDTO): Promise<Space>
  createPersonalSpace(username: string): Promise<Space>
  getSpace(input: IGetSpaceInput): Promise<Option<Space>>
  getMemberSpaces(userId: string): Promise<ISpaceDTO[]>
  setSpaceContext(context: IContext, input: IGetSpaceInput): Promise<Space>
}

export const SPACE_SERVICE = Symbol.for("SPACE_SERVICE")
export const injectSpaceService = () => inject(SPACE_SERVICE)

@singleton()
export class SpaceService implements ISpaceService {
  private logger = createLogger("SpaceService")
  constructor(
    @injectSpaceRepository()
    private readonly spaceRepository: ISpaceRepository,

    @injectSpaceQueryRepository()
    private readonly spaceQueryRepository: ISpaceQueryRepository,
  ) {}

  async createSpace(dto: ICreateSpaceDTO): Promise<Space> {
    const space = SpaceFactory.create(dto)

    await this.spaceRepository.insert(space)

    return space
  }

  async createPersonalSpace(username: string): Promise<Space> {
    return this.createSpace({
      name: username + "'s Personal Space",
      isPersonal: true,
    })
  }

  async getSpace(input: IGetSpaceInput): Promise<Option<Space>> {
    const spec = match(input)
      .returnType<Option<ISpaceSpecification>>()
      .with({ spaceId: P.string }, () => Some(WithSpaceId.fromString(input.spaceId!)))
      .with({ baseId: P.string }, () => Some(new WithSpaceBaseId(input.baseId!)))
      .with({ tableId: P.string }, () => Some(new WithSpaceTableId(input.tableId!)))
      .with({ apiToken: P.string }, () => Some(new WithSpaceApiToken(input.apiToken!)))
      .with({ shareId: P.string }, () => Some(new WithSpaceShareId(input.shareId!)))
      .with({ userId: P.string }, () => Some(new WithSpaceUserId(input.userId!)))
      .otherwise(() => None)

    if (spec.isNone()) {
      return None
    }
    const space = await this.spaceRepository.findOne(spec.unwrap())

    return space
  }

  async getMemberSpaces(userId: string): Promise<ISpaceDTO[]> {
    const spec = new WithSpaceUserId(userId)

    return this.spaceQueryRepository.find(Some(spec))
  }

  async setSpaceContext(context: IContext, input: IGetSpaceInput): Promise<Space> {
    this.logger.debug(input, "setSpaceContext")
    const space = await this.getSpace(input)
    context.setContextValue("spaceId", space.unwrap().id.value)

    return space.expect("Space not found")
  }
}
