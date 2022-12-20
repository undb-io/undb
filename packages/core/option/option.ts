import { ValueObject } from '@egodb/domain'
import type { IOptionSchema } from './option.schema'

export class Option extends ValueObject<IOptionSchema> {
  public get name() {
    return this.props.name
  }
}
