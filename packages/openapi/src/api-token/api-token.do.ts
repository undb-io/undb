import { AggregateRoot } from "@undb/domain"
import type { ISpaceId } from "@undb/space"
import { ApiTokenId } from "./api-token-id.vo"
import { ApiTokenToken } from "./api-token-token.vo"
import type { ICreateApiTokenDTO } from "./dto"

export class ApiTokenDo extends AggregateRoot<any> {
  id!: ApiTokenId
  name!: string
  userId!: string
  token!: ApiTokenToken
  spaceId!: ISpaceId

  static create(dto: ICreateApiTokenDTO) {
    const token = new ApiTokenDo()

    token.id = ApiTokenId.create()
    token.name = dto.name
    token.userId = dto.userId
    token.spaceId = dto.spaceId
    token.token = ApiTokenToken.create()

    return token
  }
}
