import { NanoID } from '@undb/domain'
import { z } from 'zod'

export class MemberID extends NanoID {
  public static MEMBER_ID_PREFIX = 'mem'
  private static MEMBER_ID_SIZE = 8

  static create(): MemberID {
    const id = NanoID.createId(MemberID.MEMBER_ID_PREFIX, MemberID.MEMBER_ID_SIZE)
    return new MemberID(id)
  }

  static from(id: string): MemberID {
    return new MemberID(id)
  }

  static fromOrCreate(id?: string): MemberID {
    if (!id) {
      return MemberID.create()
    }
    return MemberID.from(id)
  }
}

export const memberIdSchema = z.string().startsWith(MemberID.MEMBER_ID_PREFIX)
