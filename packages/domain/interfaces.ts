import { Result } from 'oxide.ts'

export interface ISpecification<T = any, V = any> {
  IsSatisfiedBy(t: T): boolean
  Mutate(t: T): Result<T, string>
  Accept(v: V): Result<void, string>
}
