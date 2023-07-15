import { and } from '@undb/domain'
import { Share } from './share.js'
import type { ICreateShareSchema } from './share.schema.js'
import type { IUnsafeCreateShare } from './share.type.js'
import type { ShareSpecification } from './specifications/index.js'
import { WithShareEnabled, WithShareId, newShareSpec, withShare } from './specifications/index.js'

export class ShareFactory {
  static create(...specs: ShareSpecification[]): Share {
    return and(...specs)
      .unwrap()
      .mutate(Share.empty())
      .unwrap()
  }

  static from(input: ICreateShareSchema): Share {
    const spec = newShareSpec(input)

    return this.create(spec)
  }

  static unsafeCreate(input: IUnsafeCreateShare): Share {
    return this.create(
      WithShareId.fromString(input.id),
      withShare(input.target?.type, input.target!.id),
      new WithShareEnabled(input.enabled),
    )
  }
}
