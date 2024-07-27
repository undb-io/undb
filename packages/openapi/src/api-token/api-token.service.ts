import { inject, singleton } from "@undb/di"
import { Option } from "@undb/domain"
import { injectApiTokenQueryRepository, type IApiTokenQueryRepository } from "./api-token.repository"
import { WithApiTokenToken } from "./specifications"

export interface IApiTokenService {
  verify(token: string): Promise<Option<string>>
}

@singleton()
export class ApiTokenService implements IApiTokenService {
  constructor(
    @injectApiTokenQueryRepository()
    private readonly repo: IApiTokenQueryRepository,
  ) {}

  async verify(token: string): Promise<Option<string>> {
    const spec = WithApiTokenToken.fromString(token)
    const apiToken = await this.repo.findOne(spec)
    return apiToken.map((t) => t.userId)
  }
}

export const API_TOKEN_SERVICE = Symbol("API_TOKEN_SERVICE")
export const injectApiTokenService = () => inject(API_TOKEN_SERVICE)
