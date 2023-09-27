import { NanoID } from '@undb/domain'
import * as z from 'zod'

export const baseIdSchema = z.string().min(1)

export class BaseId extends NanoID {
  private static BASE_ID_PREFIX = 'bas'
  private static BASE_ID_SIZE = 8

  static create(): BaseId {
    const id = NanoID.createId(BaseId.BASE_ID_PREFIX, BaseId.BASE_ID_SIZE)
    return new BaseId(id)
  }

  static createId(): string {
    return this.create().value
  }

  static from(id: string): BaseId {
    return new BaseId(id)
  }

  static fromOrCreate(id?: string): BaseId {
    if (!id) {
      return BaseId.create()
    }
    return BaseId.from(id)
  }
}
