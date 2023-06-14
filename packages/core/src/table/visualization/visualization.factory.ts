import { ChartVisualization } from './chart.visualization'
import { NumberVisualization } from './number.visualization'
import type { ICreateVisualizationSchema } from './visualization.type.js'

export class VisualizationFactory {
  static create(input: ICreateVisualizationSchema) {
    switch (input.type) {
      case 'number':
        return NumberVisualization.create(input)
      case 'chart':
        return ChartVisualization.create(input)
    }
  }
}
