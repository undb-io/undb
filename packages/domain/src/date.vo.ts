import { ValueObject } from './value-object.js'

export class DateVO extends ValueObject<Date> {
  constructor(value: Date | string | number) {
    const date = new Date(value)
    super({ value: date })
  }

  public get value(): Date {
    return this.props.value
  }

  public static now(): DateVO {
    return new DateVO(Date.now())
  }
}
