import { and } from '@undb/domain'
import { isBoolean } from 'lodash-es'
import type { Option } from 'oxide.ts'
import type { ShareId } from './share-id.vo.js'
import type { ShareTarget } from './share-target.vo.js'
import type { IUpdateShareSchema } from './share.schema.js'
import type { ShareSpecification } from './specifications/interface.js'
import { WithShareEnabled } from './specifications/share-enabled.specification.js'

export class Share {
  id!: ShareId
  target!: ShareTarget
  enabled!: boolean

  static empty() {
    return new Share()
  }

  public update(input: IUpdateShareSchema): Option<ShareSpecification> {
    const specs: ShareSpecification[] = []

    if (isBoolean(input.enabled)) {
      specs.push(new WithShareEnabled(input.enabled))
    }

    return and(...specs)
  }
}
