import { inject } from "@undb/di"
import type { Option } from "@undb/domain"
import type { IUser } from "./user.type"

export interface IUserQueryRepository {
  findOneById(userId: string): Promise<Option<IUser>>
  findOneByEmail(email: string): Promise<Option<IUser>>
}

export const USER_QUERY_REPOSITORY = Symbol("USER_QUERY_REPOSITORY")
export const injectUserQueryRepository = () => inject(USER_QUERY_REPOSITORY)

export interface IUserRepository {
  insert(user: IUser): Promise<IUser>
  updateOneById(userId: string, user: IUser): Promise<void>
}

export const USER_REPOSITORY = Symbol("USER_REPOSITORY")
export const injectUserRepository = () => inject(USER_REPOSITORY)
