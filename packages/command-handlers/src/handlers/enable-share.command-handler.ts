import { checkPermission, type ISpaceAction } from "@undb/authz"
import { EnableShareCommand } from "@undb/commands"
import { injectContext, type IContext } from "@undb/context"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectShareService, type IShareService } from "@undb/share"
import { match } from "ts-pattern"

@commandHandler(EnableShareCommand)
@singleton()
export class EnableShareCommandHandler implements ICommandHandler<EnableShareCommand, any> {
  private readonly logger = createLogger(EnableShareCommandHandler.name)

  constructor(
    @injectShareService()
    private readonly service: IShareService,
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute(command: EnableShareCommand): Promise<any> {
    this.logger.debug(command)
    const role = this.context.getCurrentRole()
    const type = command.target.type

    const permission = match(type)
      .returnType<ISpaceAction>()
      .with("table", () => "share:table")
      .with("form", () => "share:form")
      .with("view", () => "share:view")
      .with("base", () => "share:base")
      .with("dashboard", () => "share:dashboard")
      .exhaustive()

    checkPermission(role, [permission])

    await this.service.enableShare(command)
  }
}
