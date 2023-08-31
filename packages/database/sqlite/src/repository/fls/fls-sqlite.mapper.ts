import type { IQueryFLS } from '@undb/authz'
import {
  FLSFactory,
  WithFLSFieldId,
  WithFLSId,
  WithFLSPolicy,
  WithFLSSubjects,
  WithFLSTableId,
  type FLS as FLSDO,
} from '@undb/authz'
import type { FLS } from '../../entity/fls.js'

export class FLSSqliteMapper {
  static toDomain(fls: FLS): FLSDO {
    return FLSFactory.create(
      WithFLSId.fromString(fls.id),
      WithFLSTableId.fromString(fls.table.id),
      WithFLSFieldId.fromString(fls.field.id),
      WithFLSPolicy.from(fls.policy),
      WithFLSSubjects.from(fls.subjects),
    )
  }

  static toQuery(fls: FLS): IQueryFLS {
    return {
      id: fls.id,
      tableId: fls.table.id,
      fieldId: fls.field.id,
      policy: {
        action: fls.policy.action,
        filter: fls.policy.filter,
      },
      subjects: fls.subjects,
    }
  }
}
