import { ValueObject } from '@undb/domain'
import * as z from 'zod'

export const valueConstraintsSchema = z.object({
  required: z.boolean().default(false).optional(),
})

export type IValueConstraint = z.infer<typeof valueConstraintsSchema>

export class FieldValueConstraints extends ValueObject<IValueConstraint> {
  private constructor(props: IValueConstraint) {
    super(props)
  }

  static create(value: IValueConstraint): FieldValueConstraints {
    return new this(valueConstraintsSchema.parse(value))
  }

  static unsafeCreate(value: IValueConstraint): FieldValueConstraints {
    return new this(value)
  }

  public get required(): boolean {
    return !!this.props.required
  }

  public setRequired(required: boolean): FieldValueConstraints {
    return new FieldValueConstraints({
      ...this.props,
      required,
    })
  }
}
