import { Entity, PrimaryKey, Property } from '@mikro-orm/core'
import type { IVirsualizationTypeSchema, VirsualizationVO } from '@undb/core'
import { BaseEntity } from './base.js'

@Entity({ tableName: 'undb_virsualization', abstract: true, discriminatorColumn: 'type' })
export abstract class Virsualization extends BaseEntity {
  constructor(v: VirsualizationVO) {
    super()
    this.id = v.id.value
    this.type = v.type
  }

  @PrimaryKey()
  id: string

  @Property()
  type: IVirsualizationTypeSchema
}

@Entity({ discriminatorValue: 'number' })
export class NumberVirsualization extends Virsualization {}

export const virsualizationEntities = [Virsualization, NumberVirsualization]
