import type { Rel } from '@mikro-orm/core'
import { Embeddable, Embedded, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core'
import type { Widge as CoreWidge, LayoutVO } from '@undb/core'
import { BaseEntity } from './base.js'
import { View } from './view.js'

@Embeddable()
export class Layout {
  constructor(layout: LayoutVO) {
    this.x = layout.x
    this.y = layout.y
    this.h = layout.h
    this.w = layout.w
  }
  @Property()
  x!: number
  @Property()
  y!: number
  @Property()
  h!: number
  @Property()
  w!: number
}

@Entity({ tableName: 'undb_widge' })
export class Widge extends BaseEntity {
  constructor(dashboard: Rel<View>, widge: CoreWidge) {
    super()
    this.view = dashboard
    this.id = widge.id.value
    this.layout = widge.unpack().layout.unpack()
  }

  @PrimaryKey()
  id: string

  @Embedded(() => Layout, { object: true })
  layout: Layout

  @ManyToOne(() => View)
  view: Rel<View>
}

export const widgeEntities = [Widge, Layout]
