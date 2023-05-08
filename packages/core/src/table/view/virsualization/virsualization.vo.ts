import { ValueObject } from '@undb/domain'
import { VirsualizationID } from './virsualization-id.vo.js'
import type { ICreateVirsualizationSchema } from './virsualization.schema.js'
import type { IVirsualization, IVirsualizationTypeSchema } from './virsualization.type.js'

export abstract class VirsualizationVO extends ValueObject<IVirsualization> {
  id!: VirsualizationID
  abstract type: IVirsualizationTypeSchema

  static create(input: ICreateVirsualizationSchema): Omit<IVirsualization, 'type'> {
    return {
      id: VirsualizationID.fromOrCreate(input.id),
    }
  }
}
