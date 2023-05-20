import type {
  ChartVirsualization as CoreChartVirsualization,
  NumberVirsualization as CoreNumberVirsualization,
} from '@undb/core'
import type { Table } from './table.js'
import { ChartVirsualization, NumberVirsualization } from './virsualization.js'

export class VirsualizationFactory {
  static create(table: Table, v: CoreNumberVirsualization | CoreChartVirsualization) {
    switch (v.type) {
      case 'number':
        return new NumberVirsualization(table, v as CoreNumberVirsualization)
      case 'chart':
        return new ChartVirsualization(table, v as CoreChartVirsualization)
    }
  }
}
