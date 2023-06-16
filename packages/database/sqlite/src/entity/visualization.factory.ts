import type {
  ChartVisualization as CoreChartVisualization,
  NumberVisualization as CoreNumberVisualization,
} from '@undb/core'
import type { Table } from './table.js'
import { ChartVisualization, NumberVisualization } from './visualization.js'

export class VisualizationFactory {
  static create(table: Table, v: CoreNumberVisualization | CoreChartVisualization) {
    switch (v.type) {
      case 'number':
        return new NumberVisualization(table, v as CoreNumberVisualization)
      case 'chart':
        return new ChartVisualization(table, v as CoreChartVisualization)
    }
  }
}
