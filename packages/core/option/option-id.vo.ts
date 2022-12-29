import { NanoID } from '@egodb/domain'
import { optionIdSchema } from './option.schema'

export class OptionId extends NanoID {
  private static OPTION_ID_PREFIX = ''
  private static OPTION_ID_SIZE = 5
  public get value(): string {
    return this.props.value
  }

  static create(): OptionId {
    const id = NanoID.createId(OptionId.OPTION_ID_PREFIX, this.OPTION_ID_SIZE)
    return new this(optionIdSchema.parse(id))
  }

  static fromString(id: string): OptionId {
    return new this(id)
  }

  static fromNullableString(id?: string): OptionId {
    if (!id) {
      return this.create()
    }
    return new this(id)
  }
}
