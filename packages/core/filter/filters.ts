import { ValueObject } from '@egodb/domain'
import type { IFilter } from './operators'

export class Filters extends ValueObject<IFilter> {
  get value() {
    return this.props
  }
}
