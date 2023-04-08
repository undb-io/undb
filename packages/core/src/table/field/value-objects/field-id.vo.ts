import { NanoID } from '@undb/domain'

export class FieldId extends NanoID {
  public static readonly FIELD_ID_PREFIX = 'fld'
  private static FIELD_ID_SIZE = 8

  public get value(): string {
    return this.props.value
  }

  static createId(): string {
    return super.createId(this.FIELD_ID_PREFIX, this.FIELD_ID_SIZE)
  }

  static create(): FieldId {
    const id = NanoID.createId(FieldId.FIELD_ID_PREFIX, this.FIELD_ID_SIZE)
    return new this(id)
  }

  static fromString(id: string): FieldId {
    return new this(id)
  }

  static fromNullableString(id?: string): FieldId {
    if (!id) {
      return this.create()
    }
    return new this(id)
  }
}
