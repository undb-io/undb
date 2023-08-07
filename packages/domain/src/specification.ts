import type { Option, Result } from 'oxide.ts'
import { None, Ok, Some } from 'oxide.ts'

export interface ISpecVisitor {
  or(left: ISpecification, right: ISpecification): this
  not(): this
}

export interface ISpecification<T = any, V extends ISpecVisitor = ISpecVisitor> {
  isSatisfiedBy(t: T): boolean
  mutate(t: T): Result<T, string>
  accept(v: V): Result<void, string>
}

export abstract class CompositeSpecification<T = any, V extends ISpecVisitor = ISpecVisitor>
  implements ISpecification<T, V>
{
  abstract isSatisfiedBy(t: T): boolean
  abstract mutate(t: T): Result<T, string>
  abstract accept(v: V): Result<void, string>

  public and(s: ISpecification<T, V>): CompositeSpecification<T, V> {
    return new And(this, s)
  }

  public or(s: ISpecification<T, V>): CompositeSpecification<T, V> {
    return new Or(this, s)
  }

  public not(): Not<T, V> {
    return new Not(this)
  }
}

class And<T, V extends ISpecVisitor> extends CompositeSpecification<T, V> {
  constructor(
    private readonly left: ISpecification<T, V>,
    private readonly right: ISpecification<T, V>,
  ) {
    super()
  }

  isSatisfiedBy(t: T): boolean {
    return this.left.isSatisfiedBy(t) && this.right.isSatisfiedBy(t)
  }

  mutate(t: T): Result<T, string> {
    return this.left.mutate(t).and(this.right.mutate(t))
  }

  accept(v: V): Result<void, string> {
    return this.left.accept(v).and(this.right.accept(v))
  }
}

class Or<T, V extends ISpecVisitor> extends CompositeSpecification<T, V> {
  constructor(
    private readonly left: ISpecification<T, V>,
    private readonly right: ISpecification<T, V>,
  ) {
    super()
  }

  isSatisfiedBy(t: T): boolean {
    return this.left.isSatisfiedBy(t) || this.right.isSatisfiedBy(t)
  }

  mutate(t: T): Result<T, string> {
    return this.left.mutate(t).orElse(() => this.right.mutate(t))
  }

  accept(v: V): Result<void, string> {
    v.or(this.left, this.right)
    return Ok(undefined)
  }
}

class Not<T, V extends ISpecVisitor> extends CompositeSpecification<T, V> {
  constructor(public readonly spec: ISpecification<T, V>) {
    super()
  }

  isSatisfiedBy(t: T): boolean {
    return !this.spec.isSatisfiedBy(t)
  }

  mutate(): Result<T, string> {
    throw new Error('[Not.mutate] Method not implemented.')
  }

  accept(v: V): Result<void, string> {
    return this.spec.accept(v.not())
  }
}

export const and = <T, V extends ISpecVisitor>(
  ...specs: CompositeSpecification<T, V>[]
): Option<CompositeSpecification<T, V>> => {
  if (!specs.length) return None

  let s = specs[0]
  for (const spec of specs.slice(1)) {
    s = s.and(spec)
  }

  return Some(s)
}

export const andOptions = <T, V extends ISpecVisitor>(
  ...specs: Option<CompositeSpecification<T, V>>[]
): Option<CompositeSpecification<T, V>> => {
  return and(...specs.filter((spec) => spec.isSome()).map((spec) => spec.unwrap()))
}

export const or = <T, V extends ISpecVisitor>(
  ...specs: CompositeSpecification<T, V>[]
): Option<CompositeSpecification<T, V>> => {
  if (!specs.length) return None

  let s = specs[0]
  for (const spec of specs.slice(1)) {
    s = s.or(spec)
  }

  return Some(s)
}
