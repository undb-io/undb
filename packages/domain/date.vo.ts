import { isEqual } from 'date-fns'
import { ValueObject } from './value-object'

export class DateVO extends ValueObject<Date> {
  constructor(value: Date | string | number) {
    const date = new Date(value)
    super({ value: date })
  }

  public equals(vo?: DateVO): boolean {
    if (!vo) return false
    return isEqual(vo.value, this.value)
  }

  public get value(): Date {
    return this.props.value
  }

  public static now(): DateVO {
    return new DateVO(Date.now())
  }
}
