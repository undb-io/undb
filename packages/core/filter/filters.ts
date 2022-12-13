import { ValueObject } from '@egodb/domain'
import type { IRootFilter } from './filter'

export class RootFilter extends ValueObject<IRootFilter> {
  get value() {
    return this.props
  }
}
