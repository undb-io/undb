import equal from 'fast-deep-equal'
export type Primitives = string | number | boolean
export interface DomainPrimitive<T extends Primitives | Date> {
  value: T
}

type ValueObjectProps<T> = T extends Primitives | Date ? DomainPrimitive<T> : T

export abstract class ValueObject<T = any> {
  constructor(protected readonly props: ValueObjectProps<T>) {}

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false
    }
    return equal(this, vo)
  }
}
