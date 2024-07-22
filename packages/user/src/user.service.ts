import { inject, singleton } from "@undb/di"
import {
  injectUserQueryRepository,
  injectUserRepository,
  type IUserQueryRepository,
  type IUserRepository,
} from "./user.repository"

export interface IUserService {
  updateName(id: string, username: string): Promise<void>
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
}

export const USER_SERVICE = Symbol("USER_SERVICE")
export const injectUserService = () => inject(USER_SERVICE)
