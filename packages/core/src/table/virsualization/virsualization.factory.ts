import { NumberVirsualization } from './number.virsualization'
import type { ICreateVirsualizationSchema } from './virsualization.type.js'

export class VirsualizationFactory {
  static create(input: ICreateVirsualizationSchema) {
    switch (input.type) {
      case 'number':
        return NumberVirsualization.create(input)
    }
  }
}
