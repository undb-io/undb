import { ValueObject } from '@undb/domain'
import { z } from 'zod'

export const fieldDescriptionSchema = z.string()

export class FieldDescription extends ValueObject<string> {
  public get value(): string {
    return this.props.value
  }
}
