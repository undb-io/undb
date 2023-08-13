import type { CompositeSpecification } from '@undb/domain'
import { ValueObject } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None } from 'oxide.ts'
import type { FieldId } from '../field'
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

  getSpec(userId: string): Option<CompositeSpecification> {
    return convertFilterSpec(this.value, userId)
  }

  // FIXME: remove field
  public removeField(fieldId: FieldId): Option<RootFilter> {
    return None
  }

  public toJSON() {
    return this.props
  }
}
