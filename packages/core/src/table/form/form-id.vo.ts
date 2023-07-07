import { NanoID } from '@undb/domain'
import { z } from 'zod'

export const formIdSchema = z.string().min(1)

export class FormId extends NanoID {
  private static FORM_ID_PREFIX = 'fom'
  private static FORM_ID_SIZE = 8

  public get value(): string {
    return this.props.value
  }

  static createId(): string {
    return this.create().value
  }

  static create(): FormId {
    const id = NanoID.createId(FormId.FORM_ID_PREFIX, this.FORM_ID_SIZE)
    return new this(id)
  }

  static fromString(id: string): FormId {
    return new this(id)
  }

  static fromNullableString(id?: string): FormId {
    if (!id) {
      return this.create()
    }
    return new this(id)
  }
}
