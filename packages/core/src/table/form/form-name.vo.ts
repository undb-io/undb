import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const formNameSchema = z.string().min(1, { message: 'form name should has at least one character' })

export class FormName extends ValueObject<string> {
  public get value() {
    return this.props.value
  }

  public set value(value: string) {
    this.props.value = value
  }

  static create(name: string): FormName {
    return new FormName({ value: formNameSchema.parse(name) })
  }
}
