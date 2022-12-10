import { ValueObject } from '@egodb/domain'
import type { IFilters } from './operators'

export class Filters extends ValueObject<IFilters> {
  get value() {
    return this.props
  }
}
