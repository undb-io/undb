import { inject } from "@undb/di"
import type { Option } from "@undb/domain"
import type { IUser } from "./user.type"

export interface IUserQueryRepository {
  findOneById(userId: string): Promise<Option<IUser>>
}

export const USER_QUERY_REPOSITORY = Symbol("USER_QUERY_REPOSITORY")

export const injectUserQueryRepository = () => inject(USER_QUERY_REPOSITORY)
