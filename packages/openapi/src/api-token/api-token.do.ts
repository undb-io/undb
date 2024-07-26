import { AggregateRoot } from "@undb/domain"
import { ApiTokenId } from "./api-token-id.vo"
import { ApiTokenToken } from "./api-token-token.vo"
import type { ICreateApiTokenDTO } from "./dto"

export class ApiTokenDo extends AggregateRoot<any> {
  id!: ApiTokenId
  userId!: string
  token!: ApiTokenToken

  static create(dto: ICreateApiTokenDTO) {
    const token = new ApiTokenDo()

    token.id = ApiTokenId.create()
    token.userId = dto.userId
    token.token = ApiTokenToken.create()

    return token
  }
}
