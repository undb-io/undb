import { NanoID } from "@undb/domain"
import { z } from "@undb/zod"

export const apiTokenIdSchema = z.string().min(1)

export class ApiTokenId extends NanoID {
  private static API_TOKEN_ID_PREFIX = "tkn"
  private static API_TOKEN_ID_SIZE = 8

  static create(): ApiTokenId {
    const id = NanoID.createId(ApiTokenId.API_TOKEN_ID_PREFIX, ApiTokenId.API_TOKEN_ID_SIZE)
    return new ApiTokenId(id)
  }

  static createId(): string {
    return this.create().value
  }

  static from(id: string): ApiTokenId {
    return new ApiTokenId(id)
  }

  static fromOrCreate(id?: string): ApiTokenId {
    if (!id) {
      return ApiTokenId.create()
    }
    return ApiTokenId.from(id)
  }
}
