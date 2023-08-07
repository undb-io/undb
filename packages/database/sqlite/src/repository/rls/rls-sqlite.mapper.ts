import type { IQueryRLS } from '@undb/authz'
import { RLSFactory, WithRLSId, WithRLSPolicy, WithRLSSubjects, WithRLSTableId, type RLS as RLSDO } from '@undb/authz'
import type { RLS } from '../../entity/rls.js'

export class RLSSqliteMapper {
  static toDomain(rls: RLS): RLSDO {
    return RLSFactory.create(
      WithRLSId.fromString(rls.id),
      WithRLSTableId.fromString(rls.table.id),
      WithRLSPolicy.from(rls.policy),
      WithRLSSubjects.from(rls.subjects),
    )
  }

  static toQuery(rls: RLS): IQueryRLS {
    return {
      id: rls.id,
      tableId: rls.table.id,
      policy: {
        action: rls.policy.action,
        filter: rls.policy.filter,
      },
      subjects: rls.subjects,
    }
  }
}
