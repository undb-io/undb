import type { IAttachmentItem } from '@egodb/core'
import type { Rel } from '@mikro-orm/core'
import { Entity, ManyToOne, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core'
import { BaseEntity } from './base.js'
import { Table } from './table.js'

@Entity({ tableName: 'ego_attachment' })
export class Attachment extends BaseEntity {
  @PrimaryKey()
  id: string

  @PrimaryKey()
  recordId: string;

  [PrimaryKeyType]?: [string, string]

  @ManyToOne(() => Table)
  table: Rel<Table>

  @Property()
  mimeType: string

  @Property()
  name: string

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
    this.name = attachment.name
    this.token = attachment.token
  }
}
