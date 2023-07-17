import { and } from '@undb/domain'
import type { ICreateShareSchema } from '../share.schema.js'
import type { ShareSpecification } from './interface.js'
import { WithShareEnabled } from './share-enabled.specification.js'
import { WithShareId } from './share-id.specification.js'
import { withShare } from './share-target.specification.js'

export * from './interface.js'
export * from './share-enabled.specification.js'
export * from './share-id.specification.js'
export * from './share-target.specification.js'

export const newShareSpec = (input: ICreateShareSchema): ShareSpecification => {
  return and(
    WithShareId.fromNullableString(input.id),
    withShare(input.target!.type, input.target!.id),
    new WithShareEnabled(input.enabled),
  ).unwrap()
}
