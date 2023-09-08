import { dequal } from 'dequal'
import { convertPropsToObject } from './utils.js'
export type Primitives = string | number | boolean | null
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
    return dequal(vo, this)
  }

  static isValueObject(obj: unknown): obj is ValueObject<unknown> {
    return obj instanceof ValueObject
  }

  public unpack(): T {
    if (this.isDomainPrimitive(this.props)) {
      return this.props.value
    }

    const propsCopy = convertPropsToObject(this.props)

    return Object.freeze(propsCopy)
  }

  private isDomainPrimitive(obj: unknown): obj is DomainPrimitive<T & (Primitives | Date)> {
    if (Object.prototype.hasOwnProperty.call(obj, 'value')) {
      return true
    }
    return false
  }
}
