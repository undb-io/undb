import { ValueObject } from '@egodb/domain'
import type { ISorts } from './sort.schema.js'

export class Sorts extends ValueObject<ISorts> {
  public get sorts() {
    return this.props
  }

  public unpack() {
    return this.sorts
  }

  public toArray() {
    return this.sorts
  }
}
