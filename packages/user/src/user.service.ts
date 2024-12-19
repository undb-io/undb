import { inject, singleton } from "@undb/di"
import type { Option } from "@undb/domain"
import { generateIdFromEntropySize } from "lucia"
import {
  injectUserQueryRepository,
  injectUserRepository,
  type IUserQueryRepository,
  type IUserRepository,
} from "./user.repository"
import type { IUser } from "./user.type"

export interface IUserService {
  updateName(id: string, username: string): Promise<void>
  findOneById(id: string): Promise<Option<IUser>>
  findOneByEmail(email: string): Promise<Option<IUser>>
  createByEmail(email: string): Promise<IUser>
  findOneOrCreateByEmail(email: string): Promise<IUser>
}

function extractUsername(email: string): string {
  return email.split("@")[0]
}

@singleton()
export class UserService implements IUserService {
  constructor(
    @injectUserQueryRepository()
    private readonly userQueryRepository: IUserQueryRepository,
    @injectUserRepository()
    private readonly userRepository: IUserRepository,
  ) {}

  async updateName(id: string, username: string): Promise<void> {
    const user = (await this.userQueryRepository.findOneById(id)).unwrap()

    await this.userRepository.updateOneById(id, { ...user, username })
  }

  async createByEmail(email: string): Promise<IUser> {
    const username = extractUsername(email)
    const id = generateIdFromEntropySize(16)
    return this.userRepository.insert({ id, email, username, password: "" })
  }

  findOneByEmail(email: string): Promise<Option<IUser>> {
    return this.userQueryRepository.findOneByEmail(email)
  }

  findOneById(id: string): Promise<Option<IUser>> {
    return this.userQueryRepository.findOneById(id)
  }

  async findOneOrCreateByEmail(email: string): Promise<IUser> {
    const user = await this.findOneByEmail(email)
    if (user.isSome()) {
      return user.unwrap()
    }
    return this.createByEmail(email)
  }
}

export const USER_SERVICE = Symbol("USER_SERVICE")
export const injectUserService = () => inject(USER_SERVICE)
