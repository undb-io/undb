import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const visualizationNameSchema = z
  .string()
  .min(1, { message: 'visualization name should has at least one character' })

export class VisualizationName extends ValueObject<string> {
  public get value() {
    return this.props.value
  }

  public set value(value: string) {
    this.props.value = value
  }

  static create(name: string): VisualizationName {
    return new VisualizationName({ value: visualizationNameSchema.parse(name) })
  }
}
