import type { Table, ViewVO } from '@undb/core'
import { and } from '@undb/domain'
import { RLSSpecification } from './interface'
import { RLS } from './rls'
import { WithRLSId, WithRLSPolicy, WithRLSTableId, WithRLSViewId } from './specifications'
import { RLSPolicyInterface } from './value-objects'

export class RLSFactory {
  static create(...specs: RLSSpecification[]) {
    return and(...specs)
      .unwrap()
      .mutate(RLS.empty())
      .unwrap()
  }

  static from(table: Table, view: ViewVO, policy: RLSPolicyInterface) {
    return this.create(
      WithRLSId.create(),
      WithRLSTableId.fromString(table.id.value),
      WithRLSViewId.fromString(view.id.value),
      WithRLSPolicy.from(policy),
    )
  }
}
