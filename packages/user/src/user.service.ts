import { inject, singleton } from "@undb/di"
import type { Option } from "@undb/domain"
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

  findOneById(id: string): Promise<Option<IUser>> {
    return this.userQueryRepository.findOneById(id)
  }
}

export const USER_SERVICE = Symbol("USER_SERVICE")
export const injectUserService = () => inject(USER_SERVICE)
