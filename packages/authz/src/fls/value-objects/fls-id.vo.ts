import { NanoID } from '@undb/domain'
import { z } from 'zod'

export class FLSID extends NanoID {
  public static FLS_ID_PREFIX = 'fls'
  private static FLS_ID_SIZE = 8

  static create(): FLSID {
    const id = NanoID.createId(FLSID.FLS_ID_PREFIX, FLSID.FLS_ID_SIZE)
    return new FLSID(id)
  }

  static from(id: string): FLSID {
    return new FLSID(id)
  }

  static fromOrCreate(id?: string): FLSID {
    if (!id) {
      return FLSID.create()
    }
    return FLSID.from(id)
  }
}

export const flsIdSchema = z.string().startsWith(FLSID.FLS_ID_PREFIX)
