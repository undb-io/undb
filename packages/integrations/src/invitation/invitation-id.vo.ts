import { NanoID } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { z } from 'zod'

export class InvitationId extends NanoID {
  public static INVITATION_ID_PREFIX = 'ivt'
  private static INVITATION_ID_SIZE = 12

  static create(): InvitationId {
    const id = NanoID.createId(InvitationId.INVITATION_ID_PREFIX, InvitationId.INVITATION_ID_SIZE)
    return new InvitationId(id)
  }

  static createId(): string {
    return this.create().value
  }

  static from(id: string): Result<InvitationId, string> {
    return Ok(new InvitationId(id))
  }

  static fromOrCreate(id?: string): InvitationId {
    if (!id) {
      return InvitationId.create()
    }
    return InvitationId.from(id).unwrap()
  }
}

export const inviteIdSchema = z.string().startsWith(InvitationId.INVITATION_ID_PREFIX)
