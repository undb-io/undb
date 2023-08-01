import { RecordCompositeSpecification } from '@undb/core'
import { ValueObject, andOptions } from '@undb/domain'
import { Option } from 'oxide.ts'
import { RLSPolicy } from './rls-policy.vo.js'

export class RLSPolicies extends ValueObject<RLSPolicy[]> {
  public get details() {
    return this.props
  }

  public get spec(): Option<RecordCompositeSpecification> {
    return andOptions(...this.details.map((d) => d.spec))
  }
}
