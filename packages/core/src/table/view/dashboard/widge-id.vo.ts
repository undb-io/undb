import { NanoID } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Err, Ok } from 'oxide.ts'
import { z } from 'zod'
import { InvalidTableIdError } from '../../table.errors.js'

export class WidgeID extends NanoID {
  public static WIDGE_ID_PREFIX = 'wid'
  private static WIDGE_ID_SIZE = 8

  static create(): WidgeID {
    const id = NanoID.createId(WidgeID.WIDGE_ID_PREFIX, WidgeID.WIDGE_ID_SIZE)
    return new WidgeID(id)
  }

  static from(id: string): Result<WidgeID, InvalidTableIdError> {
    if (!id) {
      return Err(new InvalidTableIdError())
    }
    return Ok(new WidgeID(id))
  }

  static fromOrCreate(id?: string): WidgeID {
    if (!id) {
      return WidgeID.create()
    }
    return WidgeID.from(id).unwrap()
  }
}

export const widgeIdSchema = z.string().startsWith(WidgeID.WIDGE_ID_PREFIX)
