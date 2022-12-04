import { NanoID } from '@egodb/domain'
import * as z from 'zod'

export const recordIdSchema = z.string().min(1)

export class RecordId extends NanoID {
  private static RECORD_ID_PREFIX = ''
  private static RECORD_ID_SIZE = 8

  static create(): RecordId {
    const id = NanoID.createId(RecordId.RECORD_ID_PREFIX, RecordId.RECORD_ID_SIZE)
    return new RecordId(id)
  }

  static from(id: string): RecordId {
    return new RecordId(id)
  }

  static fromOrCreate(id?: string): RecordId {
    if (!id) {
      return RecordId.create()
    }

    return RecordId.from(id)
  }
}
