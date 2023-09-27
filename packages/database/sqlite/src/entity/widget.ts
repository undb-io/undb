import type { Rel } from '@mikro-orm/core'
import { Embeddable, Embedded, Entity, ManyToOne, OneToOne, PrimaryKey, Property } from '@mikro-orm/core'
import type { ILayoutSchema, IWidgetSchema } from '@undb/core'
import { Widget as CoreWidget, LayoutVO, WidgetID } from '@undb/core'
import { BaseEntity } from './base.entity.js'
import { View } from './view.js'
import { Visualization } from './visualization.js'

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

@Entity({ tableName: 'undb_widget' })
export class Widget extends BaseEntity {
  constructor(dashboard: Rel<View>, widget: CoreWidget) {
    super()
    this.view = dashboard
    this.id = widget.id.value
    this.layout = new Layout(widget.unpack().layout)
  }

  @PrimaryKey()
  id: string

  @Embedded(() => Layout, { object: true })
  layout: Layout

  @ManyToOne(() => View)
  view: Rel<View>

  @OneToOne(() => Visualization, { nullable: true })
  visualization?: Rel<Visualization>

  toDomain(): CoreWidget {
    return new CoreWidget({
      id: new WidgetID(this.id),
      layout: this.layout.toDomain(),
      visualization: this.visualization?.toDomain(),
    })
  }

  toQuery(): IWidgetSchema {
    return {
      id: this.id,
      layout: this.layout.toQuery(),
      visualization: this.visualization?.toQuery(),
    }
  }
}

export const widgetEntities = [Widget, Layout]
