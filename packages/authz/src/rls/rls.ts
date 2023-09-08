import { RootFilter, type TableId } from '@undb/core'
import { and } from '@undb/domain'
import { isArray, isNil } from 'lodash-es'
import type { Option } from 'oxide.ts'
import type { Subjects } from '../common/index.js'
import type { RLSSpecification } from './interface.js'
import type { IUpdateRLSSchema } from './rls.schema.js'
import { WithRLSPolicyFilter } from './specifications/rls-policy.specification.js'
import { WithRLSSubjects } from './specifications/rls-subject.specification.js'
import type { RLSID } from './value-objects/rls-id.vo.js'
import type { RLSPolicy } from './value-objects/rls-policy.vo.js'

/**
 * Record Level Security
 */
export class RLS {
  id!: RLSID
  tableId!: TableId
  policy!: RLSPolicy
  subjects!: Subjects

  static empty() {
    return new this()
  }

  public update(input: IUpdateRLSSchema): Option<RLSSpecification> {
    const specs: RLSSpecification[] = []
    if (input.policy) {
      if (!isNil(input.policy?.filter)) {
        specs.push(new WithRLSPolicyFilter(new RootFilter(input.policy.filter)))
      }
    }
    if (isArray(input.subjects)) {
      specs.push(WithRLSSubjects.from(input.subjects))
    }

    return and(...specs)
  }
}
