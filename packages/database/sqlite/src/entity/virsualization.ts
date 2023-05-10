import type { Rel } from '@mikro-orm/core'
import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import type { IVirsualizationSchema } from '@undb/core'
import { type IVirsualizationTypeSchema, type VirsualizationVO } from '@undb/core'
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
}

@Entity({ discriminatorValue: 'number' })
export class NumberVirsualization extends Virsualization {}

export const virsualizationEntities = [Virsualization, NumberVirsualization]
