import { ValueObject } from '@egodb/domain'
import type { ISorts } from './sort.schema'

export class Sorts extends ValueObject<ISorts> {
  public get sorts() {
    return this.props
  }
}
