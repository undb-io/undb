import { NanoID } from '@undb/domain'
import { z } from 'zod'

export class RLSID extends NanoID {
  public static RLS_ID_PREFIX = 'rls'
  private static RLS_ID_SIZE = 8

  static create(): RLSID {
    const id = NanoID.createId(RLSID.RLS_ID_PREFIX, RLSID.RLS_ID_SIZE)
    return new RLSID(id)
  }

  static from(id: string): RLSID {
    return new RLSID(id)
  }

  static fromOrCreate(id?: string): RLSID {
    if (!id) {
      return RLSID.create()
    }
    return RLSID.from(id)
  }
}

export const rlsIdSchema = z.string().startsWith(RLSID.RLS_ID_PREFIX)
