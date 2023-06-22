import { ValueObject } from '@undb/domain'
import { VisualizationFactory } from '../../visualization/visualization.factory.js'
import type { ICreateVisualizationSchema } from '../../visualization/visualization.type.js'
import { LayoutVO } from './layout.vo.js'
import { WidgetID } from './widget-id.vo.js'
import type { ICreateWidgetSchema } from './widget.schema.js'
import type { IWidget } from './widget.type.js'

export class Widget extends ValueObject<IWidget> {
  public get id() {
    return this.props.id
  }

  public get layout() {
    return this.props.layout
  }

  public set layout(layout: LayoutVO) {
    this.props.layout = layout
  }

  public get visualization() {
    return this.props.visualization
  }

  static create(input: ICreateWidgetSchema) {
    const layout = new LayoutVO(input.layout)
    const visualization = input.visualization ? VisualizationFactory.create(input.visualization) : undefined

    return new this({
      id: WidgetID.fromOrCreate(input.id),
      layout,
      visualization,
    })
  }

  public toJSON() {
    return {
      id: this.props.id.value,
      layout: this.props.layout.toJSON(),
      visualization: this.visualization?.toJSON(),
    }
  }

  public duplicate() {
    return Widget.create({
      layout: this.layout.toJSON(),
      visualization: this.visualization?.duplicate().toJSON() as ICreateVisualizationSchema,
    })
  }
}
