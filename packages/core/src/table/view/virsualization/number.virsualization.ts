import type { ICreateVirsualizationSchema } from './virsualization.schema.js'
import type { IVirsualizationTypeSchema } from './virsualization.type.js'
import { VirsualizationVO } from './virsualization.vo.js'

export class NumberVirsualization extends VirsualizationVO {
  type: IVirsualizationTypeSchema = 'number'

  static create(input: ICreateVirsualizationSchema) {
    return new NumberVirsualization({
      ...super.create(input),
      type: 'number',
    })
  }
}
