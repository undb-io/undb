import type { FieldId } from '@undb/core'
import { RootFilter, type TableId } from '@undb/core'
import { and } from '@undb/domain'
import { isArray, isNil } from 'lodash-es'
import type { Option } from 'oxide.ts'
import type { Subjects } from '../common/index.js'
import type { IUpdateFLSSchema } from './fls.schema.js'
import type { FLSSpecification } from './interface.js'
import { WithFLSPolicyFilter } from './specifications/fls-policy.specification.js'
import { WithFLSSubjects } from './specifications/fls-subject.specification.js'
import type { FLSID } from './value-objects/fls-id.vo.js'
import type { FLSPolicy } from './value-objects/fls-policy.vo.js'

/**
 * Field Level Security
 */
export class FLS {
  id!: FLSID
  tableId!: TableId
  fieldId!: FieldId
  policy!: FLSPolicy
  subjects!: Subjects

  static empty() {
    return new this()
  }

  public update(input: IUpdateFLSSchema): Option<FLSSpecification> {
    const specs: FLSSpecification[] = []
    if (input.policy) {
      if (!isNil(input.policy?.filter)) {
        specs.push(new WithFLSPolicyFilter(new RootFilter(input.policy.filter)))
      }
    }
    if (isArray(input.subjects)) {
      specs.push(WithFLSSubjects.from(input.subjects))
    }

    return and(...specs)
  }
}
