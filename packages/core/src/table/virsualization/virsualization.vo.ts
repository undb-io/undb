import { ValueObject } from '@undb/domain'
import { VirsualizationID } from './virsualization-id.vo.js'
import { VirsualizationName } from './virsualization-name.vo.js'
import type { ICreateVirsualizationSchema } from './virsualization.schema.js'
import type { IVirsualization, IVirsualizationTypeSchema } from './virsualization.type.js'
import type { IVirsualizationVisitor } from './virsualization.visitor.js'

export abstract class VirsualizationVO extends ValueObject<IVirsualization> {
  public get id() {
    return this.props.id
  }

  public get name() {
    return this.props.name
  }

  abstract type: IVirsualizationTypeSchema

  static create(input: ICreateVirsualizationSchema): Omit<IVirsualization, 'type'> {
    return {
      id: VirsualizationID.fromOrCreate(input.id),
      name: VirsualizationName.create(input.name),
    }
  }

  abstract accept(v: IVirsualizationVisitor): void
}
