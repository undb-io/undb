import type { CompositeSpecification } from '@egodb/domain'
import { ValueObject } from '@egodb/domain'
import type { Option } from 'oxide.ts'
import { None } from 'oxide.ts'
import type { Field } from '../field'
import type { IRootFilter } from './filter'
import { convertFilterSpec } from './filter'

export class RootFilter extends ValueObject<IRootFilter> {
  get value() {
    return this.props
  }

  get spec(): Option<CompositeSpecification> {
    return convertFilterSpec(this.value)
  }

  // FIXME: remove field
  public removeField(field: Field): Option<RootFilter> {
    return None
  }
}
