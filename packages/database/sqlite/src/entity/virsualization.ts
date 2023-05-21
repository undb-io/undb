import type { Rel } from '@mikro-orm/core'
import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import type {
  IChartAggregateFunction,
  IChartType,
  IChartVirsualizationSchema,
  INumberAggregateFunction,
  INumberVirsualizationSchema,
  IVirsualizationSchema,
} from '@undb/core'
import {
  ChartVirsualization as CoreChartVirsualization,
  NumberVirsualization as CoreNumberVirsualization,
  type IVirsualizationTypeSchema,
  type VirsualizationVO,
} from '@undb/core'
import { BaseEntity } from './base.js'
import { Table } from './table.js'

@Entity({ tableName: 'undb_virsualization', abstract: true, discriminatorColumn: 'type' })
export abstract class Virsualization extends BaseEntity {
  constructor(table: Rel<Table>, v: VirsualizationVO) {
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
  type: IVirsualizationTypeSchema

  @ManyToOne(() => Table, { cascade: [Cascade.ALL] })
  table: Rel<Table>

  abstract toQuery(): IVirsualizationSchema
  abstract toDomain(): CoreNumberVirsualization | CoreChartVirsualization
}

@Entity({ discriminatorValue: 'number' })
export class NumberVirsualization extends Virsualization {
  constructor(table: Rel<Table>, v: CoreNumberVirsualization) {
    super(table, v)
    this.fieldId = v.fieldId?.value ?? null
    this.numberAggregateFunction = v.numberAggregateFunction ?? null
  }

  @Property({ nullable: true })
  fieldId: string | null

  @Property({ type: 'string', nullable: true })
  numberAggregateFunction: INumberAggregateFunction | null

  toQuery(): INumberVirsualizationSchema {
    return {
      id: this.id,
      name: this.name,
      type: 'number',
      fieldId: this.fieldId ?? undefined,
      numberAggregateFunction: this.numberAggregateFunction ?? undefined,
    }
  }

  toDomain(): CoreNumberVirsualization {
    return CoreNumberVirsualization.create({
      id: this.id,
      type: 'number',
      name: this.name,
      fieldId: this.fieldId ?? undefined,
      numberAggregateFunction: this.numberAggregateFunction ?? undefined,
    })
  }
}

@Entity({ discriminatorValue: 'chart' })
export class ChartVirsualization extends Virsualization {
  constructor(table: Rel<Table>, v: CoreChartVirsualization) {
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

  toQuery(): IChartVirsualizationSchema {
    return {
      id: this.id,
      name: this.name,
      type: 'chart',
      chartType: this.chartType,
      fieldId: this.fieldId ?? undefined,
      chartAggregateFunction: this.chartAggregateFunction ?? undefined,
    }
  }

  toDomain(): CoreChartVirsualization {
    return CoreChartVirsualization.create({
      id: this.id,
      type: 'chart',
      chartType: this.chartType,
      name: this.name,
      fieldId: this.fieldId ?? undefined,
      chartAggregateFunction: this.chartAggregateFunction ?? undefined,
    })
  }
}

export const virsualizationEntities = [Virsualization, NumberVirsualization, ChartVirsualization]
