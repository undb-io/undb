import { ValueObject } from '@undb/domain'
import { VisualizationID } from './visualization-id.vo.js'
import { VisualizationName } from './visualization-name.vo.js'
import type { IBaseCreateVisualizationSchema } from './visualization.schema.js'
import type { IVisualization, IVisualizationTypeSchema } from './visualization.type.js'
import type { IVisualizationVisitor } from './visualization.visitor.js'

export abstract class VisualizationVO<V extends IVisualization = IVisualization> extends ValueObject<V> {
  public get id() {
    return this.props.id
  }

  public get name() {
    return this.props.name
  }

  abstract type: IVisualizationTypeSchema

  static create(input: IBaseCreateVisualizationSchema): Omit<IVisualization, 'type'> {
    return {
      id: VisualizationID.fromOrCreate(input.id),
      name: VisualizationName.create(input.name),
    }
  }

  abstract duplicate(): VisualizationVO<V>
  abstract accept(v: IVisualizationVisitor): void
}
