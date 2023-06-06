import { NanoID } from '@undb/domain'

export class RecordId extends NanoID {
  public static RECORD_ID_PREFIX = 'rec'
  private static RECORD_ID_SIZE = 8

  static create(): RecordId {
    const id = NanoID.createId(RecordId.RECORD_ID_PREFIX, RecordId.RECORD_ID_SIZE)
    return new RecordId(id)
  }

  static createId(): string {
    return this.create().value
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
