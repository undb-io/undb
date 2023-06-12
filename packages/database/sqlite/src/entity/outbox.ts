import { Entity, JsonType, PrimaryKey, Property } from '@mikro-orm/core'
import type { IEvent } from '@undb/domain'
import type { JsonObject } from 'type-fest'
import { v4 } from 'uuid'
import { BaseEntity } from './base.js'

export const OPTBOX_TABLE_NAME = 'undb_outbox'

@Entity({ tableName: OPTBOX_TABLE_NAME })
export class Outbox extends BaseEntity {
  constructor(event: IEvent) {
    super()
    this.name = event.name
    this.payload = event.payload
  }

  @PrimaryKey()
  uuid: string = v4()

  @Property({ nullable: true })
  name: string

  @Property({ type: JsonType })
  payload: JsonObject
}
