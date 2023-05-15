import type { ChartVirsualization } from './chart.virsualization'
import type { NumberVirsualization } from './number.virsualization'

export interface IVirsualizationVisitor {
  number(v: NumberVirsualization): void
  chart(v: ChartVirsualization): void
}
