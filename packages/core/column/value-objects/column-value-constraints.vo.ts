import { ValueObject } from '@egodb/domain'
import * as z from 'zod'

export const valueConstraintsSchema = z.object({
  required: z.boolean().default(false).optional(),
})

export type IValueConstraint = z.infer<typeof valueConstraintsSchema>

export class ColumnValueConstraints extends ValueObject<IValueConstraint> {
  private constructor(props: IValueConstraint) {
    super(props)
  }

  static create(value: IValueConstraint): ColumnValueConstraints {
    return new this(valueConstraintsSchema.parse(value))
  }

  static unsafeCreate(value: IValueConstraint): ColumnValueConstraints {
    return new this(value)
  }

  public get required(): boolean {
    return !!this.props.required
  }
}
