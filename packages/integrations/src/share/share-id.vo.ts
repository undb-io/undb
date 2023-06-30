import { NanoID } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { z } from 'zod'

export class ShareId extends NanoID {
  public static SHARE_ID_PREFIX = 'shr'
  private static SHARE_ID_SIZE = 12

  static create(): ShareId {
    const id = NanoID.createId(ShareId.SHARE_ID_PREFIX, ShareId.SHARE_ID_SIZE)
    return new ShareId(id)
  }

  static createId(): string {
    return this.create().value
  }

  static from(id: string): Result<ShareId, string> {
    return Ok(new ShareId(id))
  }

  static fromOrCreate(id?: string): ShareId {
    if (!id) {
      return ShareId.create()
    }
    return ShareId.from(id).unwrap()
  }
}

export const shareIdSchema = z.string().startsWith(ShareId.SHARE_ID_PREFIX)
