import { ValueObject } from '@egodb/domain'
import * as z from 'zod'

export const valueConstraintsSchema = z.object({
  required: z.boolean().default(false).optional(),
})

export type IValueConstraint = z.infer<typeof valueConstraintsSchema>

export class ValueConstraints extends ValueObject<IValueConstraint> {
  constructor(props: IValueConstraint) {
    super(valueConstraintsSchema.parse(props))
  }

  public get required(): boolean {
    return !!this.props.required
  }
}
