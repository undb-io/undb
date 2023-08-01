import { convertFilterSpec, rootFilter, type RecordCompositeSpecification } from '@undb/core'
import { ValueObject } from '@undb/domain'
import { Option } from 'oxide.ts'
import { z } from 'zod'

export const rlsDetail = z.object({
  filter: rootFilter,
})

export type RLSDetailInterface = z.infer<typeof rlsDetail>

export class RLSDetail extends ValueObject<RLSDetailInterface> {
  public get filter() {
    return this.props.filter
  }

  public get spec(): Option<RecordCompositeSpecification> {
    return convertFilterSpec(this.filter)
  }
}
