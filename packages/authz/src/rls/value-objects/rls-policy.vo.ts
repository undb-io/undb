import { convertFilterSpec, rootFilter, type RecordCompositeSpecification } from '@undb/core'
import { ValueObject } from '@undb/domain'
import { Option } from 'oxide.ts'
import { z } from 'zod'

export const rlsPolicy = z.object({
  filter: rootFilter,
})

export type RLSPolicyInterface = z.infer<typeof rlsPolicy>

export class RLSPolicy extends ValueObject<RLSPolicyInterface> {
  public get filter() {
    return this.props.filter
  }

  static from(detail: RLSPolicyInterface): RLSPolicy {
    return new this(detail)
  }

  public get spec(): Option<RecordCompositeSpecification> {
    return convertFilterSpec(this.filter)
  }
}
