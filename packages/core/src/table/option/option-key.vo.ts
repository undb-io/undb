import { NanoID } from '@undb/domain'
import { optionIdSchema } from './option.schema.js'

export class OptionKey extends NanoID {
  private static OPTION_ID_PREFIX = 'opt'
  private static OPTION_ID_SIZE = 5
  public get value(): string {
    return this.props.value
  }

  static create(): OptionKey {
    const id = NanoID.createId(OptionKey.OPTION_ID_PREFIX, this.OPTION_ID_SIZE)
    return new this(optionIdSchema.parse(id))
  }

  static createId(): string {
    return this.create().value
  }

  static fromString(key: string): OptionKey {
    return new this(key)
  }

  static fromNullableString(key?: string): OptionKey {
    if (!key) {
      return this.create()
    }
    return new this(key)
  }
}
