import { Entity, JsonType, PrimaryKey, Property } from '@mikro-orm/core'
import { type IEvent } from '@undb/domain'
import { BaseEntity } from './base.entity.js'

export const OPTBOX_TABLE_NAME = 'undb_outbox'

@Entity({ tableName: OPTBOX_TABLE_NAME })
export class Outbox extends BaseEntity {
  constructor(event: IEvent) {
    super()
    this.uuid = event.id
    this.name = event.name
    this.operatorId = event.operatorId
    this.payload = event.payload
    this.meta = event.meta
    this.timestamp = event.timestamp
  }

  @PrimaryKey()
  uuid: string

  @Property({ nullable: true })
  name: string

  @Property({ nullable: true })
  operatorId: string

  @Property()
  timestamp: Date

  @Property({ type: JsonType })
  payload: object

  @Property({ type: JsonType, nullable: true })
  meta?: object
}
