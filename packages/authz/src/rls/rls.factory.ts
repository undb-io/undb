import type { Table } from '@undb/core'
import { and } from '@undb/domain'
import type { ISubject } from '../common/index.js'
import type { RLSSpecification } from './interface.js'
import { RLS } from './rls.js'
import type { IQueryRLS } from './rls.schema.js'
import { WithRLSId, WithRLSPolicy, WithRLSSubjects, WithRLSTableId } from './specifications/index.js'
import type { RLSPolicyInterface } from './value-objects/index.js'

export class RLSFactory {
  static create(...specs: RLSSpecification[]) {
    return and(...specs)
      .unwrap()
      .mutate(RLS.empty())
      .unwrap()
  }

  static from(table: Table, policy: RLSPolicyInterface, subjects: ISubject[]) {
    return this.create(
      WithRLSId.create(),
      WithRLSTableId.fromString(table.id.value),
      WithRLSPolicy.from(policy),
      WithRLSSubjects.from(subjects),
    )
  }

  static fromQuery(rls: IQueryRLS): RLS {
    return this.create(
      WithRLSId.fromString(rls.id),
      WithRLSTableId.fromString(rls.tableId),
      WithRLSPolicy.from(rls.policy),
      WithRLSSubjects.from(rls.subjects),
    )
  }
}
