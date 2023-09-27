import type { Rel } from '@mikro-orm/core'
import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import type {
  IChartAggregateFunction,
  IChartType,
  IChartVisualizationSchema,
  INumberAggregateFunction,
  INumberVisualizationSchema,
  IVisualizationSchema,
} from '@undb/core'
import {
  ChartVisualization as CoreChartVisualization,
  NumberVisualization as CoreNumberVisualization,
  type IVisualizationTypeSchema,
  type VisualizationVO,
} from '@undb/core'
import { BaseEntity } from './base.entity.js'
import { Table } from './table.js'

@Entity({ tableName: 'undb_visualization', abstract: true, discriminatorColumn: 'type' })
export abstract class Visualization extends BaseEntity {
  constructor(table: Rel<Table>, v: VisualizationVO) {
    super()
    this.table = table
    this.id = v.id.value
    this.type = v.type
    this.name = v.name.value
  }

  @PrimaryKey()
  id: string

  @Property()
  name: string

  @Property()
  type: IVisualizationTypeSchema

  @ManyToOne(() => Table, { cascade: [Cascade.ALL] })
  table: Rel<Table>

  abstract toQuery(): IVisualizationSchema
  abstract toDomain(): CoreNumberVisualization | CoreChartVisualization
}

@Entity({ discriminatorValue: 'number' })
export class NumberVisualization extends Visualization {
  constructor(table: Rel<Table>, v: CoreNumberVisualization) {
    super(table, v)
    this.fieldId = v.fieldId?.value ?? null
    this.numberAggregateFunction = v.numberAggregateFunction ?? null
  }

  @Property({ nullable: true })
  fieldId: string | null

  @Property({ type: 'string', nullable: true })
  numberAggregateFunction: INumberAggregateFunction | null

  toQuery(): INumberVisualizationSchema {
    return {
      id: this.id,
      name: this.name,
      type: 'number',
      fieldId: this.fieldId ?? undefined,
      numberAggregateFunction: this.numberAggregateFunction ?? undefined,
    }
  }

  toDomain(): CoreNumberVisualization {
    return CoreNumberVisualization.create({
      id: this.id,
      type: 'number',
      name: this.name,
      fieldId: this.fieldId ?? undefined,
      numberAggregateFunction: this.numberAggregateFunction ?? undefined,
    })
  }
}

@Entity({ discriminatorValue: 'chart' })
export class ChartVisualization extends Visualization {
  constructor(table: Rel<Table>, v: CoreChartVisualization) {
    super(table, v)
    this.fieldId = v.fieldId?.value ?? null
    this.chartType = v.chartType
    this.chartAggregateFunction = v.chartAggregateFunction ?? null
  }

  @Property({ nullable: true })
  fieldId: string | null

  @Property({ type: 'string', nullable: true })
  chartAggregateFunction: IChartAggregateFunction | null

  @Property({ type: 'string' })
  chartType: IChartType

  toQuery(): IChartVisualizationSchema {
    return {
      id: this.id,
      name: this.name,
      type: 'chart',
      chartType: this.chartType,
      fieldId: this.fieldId ?? undefined,
      chartAggregateFunction: this.chartAggregateFunction ?? undefined,
    }
  }

  toDomain(): CoreChartVisualization {
    return CoreChartVisualization.create({
      id: this.id,
      type: 'chart',
      chartType: this.chartType,
      name: this.name,
      fieldId: this.fieldId ?? undefined,
      chartAggregateFunction: this.chartAggregateFunction ?? undefined,
    })
  }
}

export const visualizationEntities = [Visualization, NumberVisualization, ChartVisualization]
