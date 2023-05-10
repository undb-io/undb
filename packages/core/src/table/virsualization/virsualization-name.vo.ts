import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const virsualizationNameSchema = z
  .string()
  .min(1, { message: 'virsualization name should has at least one character' })

export class VirsualizationName extends ValueObject<string> {
  public get value() {
    return this.props.value
  }

  public set value(value: string) {
    this.props.value = value
  }

  static create(name: string): VirsualizationName {
    return new VirsualizationName({ value: virsualizationNameSchema.parse(name) })
  }
}
