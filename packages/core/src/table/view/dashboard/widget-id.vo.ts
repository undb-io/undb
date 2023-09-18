import { NanoID } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Err, Ok } from 'oxide.ts'
import { z } from 'zod'
import { InvalidTableIdError } from '../../table.errors.js'

export class WidgetID extends NanoID {
  public static WIDGE_ID_PREFIX = 'wid'
  private static WIDGE_ID_SIZE = 8

  static create(): WidgetID {
    const id = NanoID.createId(WidgetID.WIDGE_ID_PREFIX, WidgetID.WIDGE_ID_SIZE)
    return new WidgetID(id)
  }

  static createId(): string {
    return super.createId(this.WIDGE_ID_PREFIX, this.WIDGE_ID_SIZE)
  }

  static from(id: string): Result<WidgetID, InvalidTableIdError> {
    if (!id) {
      return Err(new InvalidTableIdError())
    }
    return Ok(new WidgetID(id))
  }

  static fromOrCreate(id?: string): WidgetID {
    if (!id) {
      return WidgetID.create()
    }
    return WidgetID.from(id).unwrap()
  }
}

export const widgetIdSchema = z.string().startsWith(WidgetID.WIDGE_ID_PREFIX)
