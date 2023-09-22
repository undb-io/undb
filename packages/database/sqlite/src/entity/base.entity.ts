import { Index, Property } from '@mikro-orm/core'
import { SoftDelete } from '../decorators/soft-delete.decorator.js'

@SoftDelete()
export abstract class BaseEntity {
  @Property()
  createdAt: Date = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date()

  @Index()
  @Property({ nullable: true })
  deletedAt?: Date

  public get isDeleted() {
    return !!this.deletedAt
  }
}
