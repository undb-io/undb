import type { IRootFilter } from '@undb/core'
import { convertFilterSpec, rootFilter, type RecordCompositeSpecification } from '@undb/core'
import { ValueObject } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { z } from 'zod'

export const flsActions = ['update'] as const
export const flsAction = z.enum(flsActions)
export type IFLSAction = z.infer<typeof flsAction>

export const flsPolicy = z.object({
  action: flsAction,
  filter: rootFilter,
})

export type FLSPolicyInterface = z.infer<typeof flsPolicy>

export class FLSPolicy extends ValueObject<FLSPolicyInterface> {
  public get action() {
    return this.props.action
  }

  public set action(action: IFLSAction) {
    this.props.action = action
  }

  public get filter() {
    return this.props.filter
  }

  public set filter(filter: IRootFilter) {
    this.props.filter = filter
  }

  static from(detail: FLSPolicyInterface): FLSPolicy {
    return new this(detail)
  }

  public getSpec(userId: string): Option<RecordCompositeSpecification> {
    return convertFilterSpec(this.filter, userId)
  }
}
