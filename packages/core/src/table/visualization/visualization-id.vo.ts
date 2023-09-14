import { NanoID } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Err, Ok } from 'oxide.ts'
import { z } from 'zod'
import { InvalidTableIdError } from '../table.errors.js'

export const visualizationIdSchema = z.string().startsWith('vir')

export class VisualizationID extends NanoID {
  private static VIR_ID_PREFIX = 'vir'
  private static VIR_ID_SIZE = 8

  static create(): VisualizationID {
    const id = NanoID.createId(VisualizationID.VIR_ID_PREFIX, VisualizationID.VIR_ID_SIZE)
    return new VisualizationID(id)
  }

  static createId(): string {
    return this.create().value
  }

  static from(id: string): Result<VisualizationID, InvalidTableIdError> {
    if (!id) {
      return Err(new InvalidTableIdError())
    }
    return Ok(new VisualizationID(id))
  }

  static fromOrCreate(id?: string): VisualizationID {
    if (!id) {
      return VisualizationID.create()
    }
    return VisualizationID.from(id).unwrap()
  }
}
