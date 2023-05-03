import type { CompositeSpecification } from '@undb/domain'
import { ValueObject } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None } from 'oxide.ts'
import type { Field } from '../field'
import type { IGroup, IRootFilter } from './filter.js'
import { convertFilterSpec, isGroup } from './filter.js'

export class RootFilter extends ValueObject<IRootFilter> {
  get value() {
    return this.props
  }

  get group(): IGroup {
    if (Array.isArray(this.value)) {
      return { conjunction: '$and', children: this.value }
    }
    if (isGroup(this.value)) {
      return this.value
    }
    return { conjunction: '$and', children: [this.value] }
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
