import type { Table, ViewVO } from '@undb/core'
import { and } from '@undb/domain'
import type { RLSSpecification } from './interface.js'
import { RLS } from './rls.js'
import type { IQueryRLS } from './rls.schema.js'
import { WithRLSId, WithRLSPolicy, WithRLSTableId, WithRLSViewId } from './specifications/index.js'
import type { RLSPolicyInterface } from './value-objects/index.js'

export class RLSFactory {
  static create(...specs: RLSSpecification[]) {
    return and(...specs)
      .unwrap()
      .mutate(RLS.empty())
      .unwrap()
  }

  static from(table: Table, view: ViewVO | undefined, policy: RLSPolicyInterface) {
    return this.create(
      WithRLSId.create(),
      WithRLSTableId.fromString(table.id.value),
      WithRLSViewId.fromString(view?.id.value),
      WithRLSPolicy.from(policy),
    )
  }

  static fromQuery(rls: IQueryRLS): RLS {
    return this.create(
      WithRLSId.fromString(rls.id),
      WithRLSTableId.fromString(rls.tableId),
      WithRLSViewId.fromString(rls.viewId),
      WithRLSPolicy.from(rls.policy),
    )
  }
}
