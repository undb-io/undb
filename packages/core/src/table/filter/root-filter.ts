import type { CompositeSpecification } from '@undb/domain'
import { ValueObject } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None } from 'oxide.ts'
import type { Field } from '../field'
import type { IRootFilter } from './filter.js'
import { convertFilterSpec } from './filter.js'

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

  public toJSON() {
    return this.props
  }
}
