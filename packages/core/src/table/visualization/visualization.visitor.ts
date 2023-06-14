import type { ChartVisualization } from './chart.visualization'
import type { NumberVisualization } from './number.visualization'

export interface IVisualizationVisitor {
  number(v: NumberVisualization): void
  chart(v: ChartVisualization): void
}
