import { CreateApiTokenCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { ApiTokenDo, injectApiTokenRepository, type IApiTokenRepository } from "@undb/openapi"

@commandHandler(CreateApiTokenCommand)
@singleton()
export class CreateApiTokenCommandHandler implements ICommandHandler<CreateApiTokenCommand, any> {
  private readonly logger = createLogger(CreateApiTokenCommandHandler.name)

  constructor(
    @injectApiTokenRepository()
    private readonly repository: IApiTokenRepository,
  ) {}

  async execute(command: CreateApiTokenCommand): Promise<any> {
    this.logger.debug(command)

    const token = ApiTokenDo.create(command)

    await this.repository.insert(token)

    return token.id.value
  }
}
