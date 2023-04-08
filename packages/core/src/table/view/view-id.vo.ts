import { NanoID } from '@undb/domain'
import { z } from 'zod'

export const viewIdSchema = z.string().min(1)

export class ViewId extends NanoID {
  private static VIEW_ID_PREFIX = 'viw'
  private static VIEW_ID_SIZE = 8

  public get value(): string {
    return this.props.value
  }

  static createId(): string {
    return this.create().value
  }

  static create(): ViewId {
    const id = NanoID.createId(ViewId.VIEW_ID_PREFIX, this.VIEW_ID_SIZE)
    return new this(id)
  }

  static fromString(id: string): ViewId {
    return new this(id)
  }

  static fromNullableString(id?: string): ViewId {
    if (!id) {
      return this.create()
    }
    return new this(id)
  }
}
