import type { UserEmpty, UserEqual } from "./abstract-user-value.specification"

export interface IAbstractUserFieldValueVisitor {
  userEqual(spec: UserEqual): void
  userEmpty(spec: UserEmpty): void
}
