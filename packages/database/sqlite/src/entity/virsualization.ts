import type { Rel } from '@mikro-orm/core'
import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import type { INumberAggregateFunction, INumberVirsualizationSchema, IVirsualizationSchema } from '@undb/core'
import {
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

  toQuery(): IVirsualizationSchema {
    return {
      id: this.id,
      type: this.type,
      name: this.name,
    }
  }

  abstract toDomain(): VirsualizationVO
}

@Entity({ discriminatorValue: 'number' })
export class NumberVirsualization extends Virsualization {
  constructor(table: Rel<Table>, v: CoreNumberVirsualization) {
    super(table, v)
    this.fieldId = v.fieldId?.value
    this.numberAggregateFunction = v.numberAggregateFunction
  }

  @Property({ nullable: true })
  fieldId?: string

  @Property({ type: 'string', nullable: true })
  numberAggregateFunction?: INumberAggregateFunction

  toQuery(): INumberVirsualizationSchema {
    return {
      ...super.toQuery(),
      fieldId: this.fieldId,
      numberAggregateFunction: this.numberAggregateFunction,
    }
  }

  toDomain(): CoreNumberVirsualization {
    return CoreNumberVirsualization.create({
      id: this.id,
      type: this.type,
      name: this.name,
      fieldId: this.fieldId,
      numberAggregateFunction: this.numberAggregateFunction,
    })
  }
}

export const virsualizationEntities = [Virsualization, NumberVirsualization]
