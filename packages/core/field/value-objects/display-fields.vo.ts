import { ValueObject } from '@egodb/domain'
import type { FieldId } from './field-id.vo'

export class DisplayFields extends ValueObject<FieldId[]> {
  public get ids() {
    return this.props
  }
}
