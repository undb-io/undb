import type { Field, Table } from '@undb/core'
import { and } from '@undb/domain'
import type { ISubject } from '../common/index.js'
import { FLS } from './fls.js'
import type { IQueryFLS } from './fls.schema.js'
import type { FLSSpecification } from './interface.js'
import { WithFLSFieldId, WithFLSId, WithFLSPolicy, WithFLSSubjects, WithFLSTableId } from './specifications/index.js'
import type { FLSPolicyInterface } from './value-objects/index.js'

export class FLSFactory {
  static create(...specs: FLSSpecification[]) {
    return and(...specs)
      .unwrap()
      .mutate(FLS.empty())
      .unwrap()
  }

  static from(table: Table, field: Field, policy: FLSPolicyInterface, subjects: ISubject[]) {
    return this.create(
      WithFLSId.create(),
      WithFLSTableId.fromString(table.id.value),
      WithFLSPolicy.from(policy),
      WithFLSSubjects.from(subjects),
      new WithFLSFieldId(field.id),
    )
  }

  static fromQuery(fls: IQueryFLS): FLS {
    return this.create(
      WithFLSId.fromString(fls.id),
      WithFLSTableId.fromString(fls.tableId),
      WithFLSFieldId.fromString(fls.fieldId),
      WithFLSPolicy.from(fls.policy),
      WithFLSSubjects.from(fls.subjects),
    )
  }
}
