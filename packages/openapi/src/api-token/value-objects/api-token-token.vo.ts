import { ValueObject } from '@undb/domain'
import { nanoid } from 'nanoid'
import { z } from 'zod'

const TOKEN_LENGTH = 40

export const apiTokenTokenSchema = z.string().length(TOKEN_LENGTH)

export type IApiTokenTokenSchema = z.infer<typeof apiTokenTokenSchema>

export class ApiTokenToken extends ValueObject<IApiTokenTokenSchema> {
  static fromString(token: string) {
    return new this({ value: apiTokenTokenSchema.parse(token) })
  }
  static create() {
    const token = nanoid(TOKEN_LENGTH)
    return new this({ value: token })
  }
}
