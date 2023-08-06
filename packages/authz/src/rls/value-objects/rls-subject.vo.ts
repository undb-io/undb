import { userIdSchema } from '@undb/core'
import { ValueObject } from '@undb/domain'
import { z } from 'zod'

const rlsSubjectUser = z.object({
  type: z.literal('user'),
  id: userIdSchema,
})

export const rlsSubject = rlsSubjectUser

export type IRLSSubject = z.infer<typeof rlsSubject>

export class RLSSubject extends ValueObject<IRLSSubject> {
  public get value() {
    return this.props
  }
}
