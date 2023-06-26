import { and } from '@undb/domain'
import { ICreateShareSchema } from '../share.schema.js'
import { ShareSpecification } from './interface.js'
import { WithShareId } from './share-id.specification.js'
import { WithShareView } from './share-target.specification.js'

export * from './interface.js'
export * from './share-id.specification.js'
export * from './share-target.specification.js'

export const newShareSpec = (input: ICreateShareSchema): ShareSpecification => {
  return and(WithShareId.fromNullableString(input.id), new WithShareView(input.target!.id)).unwrap()
}
