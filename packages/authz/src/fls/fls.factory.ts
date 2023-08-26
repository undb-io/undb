import type { Table } from '@undb/core'
import { and } from '@undb/domain'
import { FLS } from './fls.js'
import type { IQueryFLS } from './fls.schema.js'
import type { FLSSpecification } from './interface.js'
import { WithFLSId, WithFLSPolicy, WithFLSTableId } from './specifications/index.js'
import type { FLSPolicyInterface } from './value-objects/index.js'

export class FLSFactory {
  static create(...specs: FLSSpecification[]) {
    return and(...specs)
      .unwrap()
      .mutate(FLS.empty())
      .unwrap()
  }

  static from(table: Table, policy: FLSPolicyInterface) {
    return this.create(WithFLSId.create(), WithFLSTableId.fromString(table.id.value), WithFLSPolicy.from(policy))
  }

  static fromQuery(rls: IQueryFLS): FLS {
    return this.create(
      WithFLSId.fromString(rls.id),
      WithFLSTableId.fromString(rls.tableId),
      WithFLSPolicy.from(rls.policy),
    )
  }
}
