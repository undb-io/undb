import { NanoID } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Err, Ok } from 'oxide.ts'
import { z } from 'zod'
import { InvalidTableIdError } from '../table.errors.js'

export const virsualizationIdSchema = z.string().startsWith('vir')

export class VirsualizationID extends NanoID {
  private static VIR_ID_PREFIX = 'vir'
  private static VIR_ID_SIZE = 8

  static create(): VirsualizationID {
    const id = NanoID.createId(VirsualizationID.VIR_ID_PREFIX, VirsualizationID.VIR_ID_SIZE)
    return new VirsualizationID(id)
  }

  static from(id: string): Result<VirsualizationID, InvalidTableIdError> {
    if (!id) {
      return Err(new InvalidTableIdError())
    }
    return Ok(new VirsualizationID(id))
  }

  static fromOrCreate(id?: string): VirsualizationID {
    if (!id) {
      return VirsualizationID.create()
    }
    return VirsualizationID.from(id).unwrap()
  }
}
