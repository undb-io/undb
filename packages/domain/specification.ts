import { Result } from 'oxide.ts'

export interface ISpecification<T = any, V = any> {
  isSatisfiedBy(t: T): boolean
  mutate(t: T): Result<T, string>
  accept(v: V): Result<void, string>
}
