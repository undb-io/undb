import type { UserEmpty, UserEqual } from "../abstractions/abstract-user-value.specification"

export interface IUserFieldValueVisitor {
  userEqual(spec: UserEqual): void
  userEmpty(spec: UserEmpty): void
}
