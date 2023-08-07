import type { IRootFilter } from '@undb/core'
import { convertFilterSpec, rootFilter, type RecordCompositeSpecification } from '@undb/core'
import { ValueObject } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { z } from 'zod'

export const rlsActions = ['list', 'view', 'create', 'update', 'delete'] as const
export const rlsAction = z.enum(rlsActions)
export type IRLSAction = z.infer<typeof rlsAction>

export const rlsPolicy = z.object({
  action: rlsAction,
  filter: rootFilter,
})

export type RLSPolicyInterface = z.infer<typeof rlsPolicy>

export class RLSPolicy extends ValueObject<RLSPolicyInterface> {
  public get action() {
    return this.props.action
  }

  public set action(action: IRLSAction) {
    this.props.action = action
  }

  public get filter() {
    return this.props.filter
  }

  public set filter(filter: IRootFilter) {
    this.props.filter = filter
  }

  static from(detail: RLSPolicyInterface): RLSPolicy {
    return new this(detail)
  }

  public getSpec(userId: string): Option<RecordCompositeSpecification> {
    return convertFilterSpec(this.filter, userId)
  }
}
