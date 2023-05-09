import type { NumberVirsualization } from './number.virsualization'

export interface IVirsualizationVisitor {
  number(v: NumberVirsualization): void
}
