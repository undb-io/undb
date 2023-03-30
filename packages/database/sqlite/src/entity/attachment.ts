import type { IAttachmentItem } from '@egodb/core'
import type { Rel } from '@mikro-orm/core'
import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import { BaseEntity } from './base.js'
import { Table } from './table.js'

@Entity({ tableName: 'ego_attachment' })
export class Attachment extends BaseEntity {
  @PrimaryKey()
  id: string

  @Property()
  recordId: string

  @ManyToOne(() => Table)
  table: Rel<Table>

  @Property()
  mimeType: string

  @Property()
  size: number

  @Property()
  token: string

  constructor(table: Rel<Table>, recordId: string, attachment: IAttachmentItem) {
    super()
    this.table = table
    this.recordId = recordId
    this.id = attachment.id
    this.mimeType = attachment.mimeType
    this.size = attachment.size
    this.token = attachment.token
  }
}
