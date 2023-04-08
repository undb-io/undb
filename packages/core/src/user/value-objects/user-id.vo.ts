import { NanoID } from '@egodb/domain'
import type { Result } from 'oxide.ts'
import { Err, Ok } from 'oxide.ts'
import { InvalidUserIdError } from '../user.errors.js'

export class UserId extends NanoID {
  private static USER_ID_PREFIX = 'tbl'
  private static USER_ID_SIZE = 8

  static create(): UserId {
    const id = NanoID.createId(UserId.USER_ID_PREFIX, UserId.USER_ID_SIZE)
    return new UserId(id)
  }

  static from(id: string): Result<UserId, InvalidUserIdError> {
    if (!id) {
      return Err(new InvalidUserIdError())
    }
    return Ok(new UserId(id))
  }

  static fromOrCreate(id?: string): UserId {
    if (!id) {
      return UserId.create()
    }
    return UserId.from(id).unwrap()
  }
}
