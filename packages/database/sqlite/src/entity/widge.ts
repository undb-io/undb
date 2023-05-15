import type { Rel } from '@mikro-orm/core'
import { Embeddable, Embedded, Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core'
import type { ILayoutSchema, IWidgeSchema } from '@undb/core'
import { Widge as CoreWidge, LayoutVO, WidgeID } from '@undb/core'
import { BaseEntity } from './base.js'
import { View } from './view.js'
import { Virsualization } from './virsualization.js'

@Embeddable()
export class Layout {
  constructor(layout: LayoutVO) {
    this.x = layout.x
    this.y = layout.y
    this.h = layout.h
    this.w = layout.w
  }
  @Property()
  x: number
  @Property()
  y: number
  @Property()
  h: number
  @Property()
  w: number

  toDomain(): LayoutVO {
    return new LayoutVO(this)
  }

  toQuery(): ILayoutSchema {
    return {
      x: this.x,
      y: this.y,
      h: this.h,
      w: this.w,
    }
  }
}

@Entity({ tableName: 'undb_widge' })
export class Widge extends BaseEntity {
  constructor(dashboard: Rel<View>, widge: CoreWidge) {
    super()
    this.view = dashboard
    this.id = widge.id.value
    this.layout = new Layout(widge.unpack().layout)
  }

  @PrimaryKey()
  id: string

  @Embedded(() => Layout, { object: true })
  layout: Layout

  @ManyToOne(() => View)
  view: Rel<View>

  @OneToOne(() => Virsualization, { nullable: true })
  virsualization?: Rel<Virsualization>

  toDomain(): CoreWidge {
    return new CoreWidge({
      id: new WidgeID(this.id),
      layout: this.layout.toDomain(),
      virsualization: this.virsualization?.toDomain(),
    })
  }

  toQuery(): IWidgeSchema {
    return {
      id: this.id,
      layout: this.layout.toQuery(),
      virsualization: this.virsualization?.toQuery(),
    }
  }
}

export const widgeEntities = [Widge, Layout]
