import { userIdSchema } from '@undb/core'
import { ValueObject } from '@undb/domain'
import { z } from 'zod'

const subjectUser = z.object({
  type: z.literal('user'),
  id: userIdSchema,
})

export const subject = subjectUser

export type ISubject = z.infer<typeof subject>

export class Subject extends ValueObject<ISubject> {
  public get value() {
    return this.props
  }

  public get isUser() {
    return this.value.type === 'user'
  }
}
