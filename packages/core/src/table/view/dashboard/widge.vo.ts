import { ValueObject } from '@undb/domain'
import { VisualizationFactory } from '../../visualization/visualization.factory.js'
import type { ICreateVisualizationSchema } from '../../visualization/visualization.type.js'
import { LayoutVO } from './layout.vo.js'
import { WidgeID } from './widge-id.vo.js'
import type { ICreateWidgeSchema } from './widge.schema.js'
import type { IWidge } from './widge.type.js'

export class Widge extends ValueObject<IWidge> {
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

  static create(input: ICreateWidgeSchema) {
    const layout = new LayoutVO(input.layout)
    const visualization = input.visualization ? VisualizationFactory.create(input.visualization) : undefined

    return new this({
      id: WidgeID.fromOrCreate(input.id),
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
    return Widge.create({
      layout: this.layout.toJSON(),
      visualization: this.visualization?.duplicate().toJSON() as ICreateVisualizationSchema,
    })
  }
}
