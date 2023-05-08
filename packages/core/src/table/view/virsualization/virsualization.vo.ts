import { ValueObject } from '@undb/domain'
import type { IVirsualization } from './virsualization.type.js'

export class VirsualizationVO extends ValueObject<IVirsualization> {
  public get type() {
    return this.props.type
  }
}
