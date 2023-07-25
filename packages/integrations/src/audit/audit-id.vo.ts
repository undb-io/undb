import { NanoID } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { z } from 'zod'

export class AuditId extends NanoID {
  public static AUDIT_ID_PREFIX = 'aud'
  private static AUDIT_ID_SIZE = 12

  static create(): AuditId {
    const id = NanoID.createId(AuditId.AUDIT_ID_PREFIX, AuditId.AUDIT_ID_SIZE)
    return new AuditId(id)
  }

  static createId(): string {
    return this.create().value
  }

  static from(id: string): Result<AuditId, string> {
    return Ok(new AuditId(id))
  }

  static fromOrCreate(id?: string): AuditId {
    if (!id) {
      return AuditId.create()
    }
    return AuditId.from(id).unwrap()
  }
}

export const auditIdSchema = z.string().startsWith(AuditId.AUDIT_ID_PREFIX)
