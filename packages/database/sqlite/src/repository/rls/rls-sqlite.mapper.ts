import { RLS as RLSDO, RLSFactory, WithRLSId, WithRLSPolicy, WithRLSTableId, WithRLSViewId } from '@undb/authz'
import { RLS } from '../../entity/rls.js'

export class RLSSqliteMapper {
  static toDomain(rls: RLS): RLSDO {
    return RLSFactory.create(
      WithRLSId.fromString(rls.id),
      WithRLSTableId.fromString(rls.table.id),
      WithRLSViewId.fromString(rls.view.id),
      WithRLSPolicy.from(rls.policy),
    )
  }
}
