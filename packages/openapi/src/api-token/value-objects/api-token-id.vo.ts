import { NanoID } from '@undb/domain'
import { z } from 'zod'

export class ApiTokenID extends NanoID {
  public static API_TOKEN_ID_PREFIX = 'tkn'
  private static API_TOKEN_ID_SIZE = 8

  static create(): ApiTokenID {
    const id = NanoID.createId(ApiTokenID.API_TOKEN_ID_PREFIX, ApiTokenID.API_TOKEN_ID_SIZE)
    return new ApiTokenID(id)
  }

  static from(id: string): ApiTokenID {
    return new ApiTokenID(id)
  }

  static fromOrCreate(id?: string): ApiTokenID {
    if (!id) {
      return ApiTokenID.create()
    }
    return ApiTokenID.from(id)
  }
}

export const apiTokenIdSchema = z.string().startsWith(ApiTokenID.API_TOKEN_ID_PREFIX)
