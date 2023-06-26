import { and } from '@undb/domain'
import { Share } from './share.js'
import { ICreateShareSchema } from './share.schema.js'
import type { IUnsafeCreateShare } from './share.type.js'
import type { ShareSpecification } from './specifications/index.js'
import { WithShareId, WithShareView, newShareSpec } from './specifications/index.js'

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
    return this.create(WithShareId.fromString(input.id), new WithShareView(input.target!.id))
  }
}
