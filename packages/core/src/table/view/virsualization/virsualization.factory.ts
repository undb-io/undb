import { NumberVirsualization } from './number.virsualization'
import type { ICreateVirsualizationSchema } from './virsualization.schema'

export class VirsualizationFactory {
  static create(input: ICreateVirsualizationSchema) {
    switch (input.type) {
      case 'number':
        return NumberVirsualization.create(input)
    }
  }
}
