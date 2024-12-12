import { container, singleton, type DependencyContainer } from "@undb/di"
import type { Command, CommandMetadata, ICommandBus, ICommandHandler, ICommandPublisher } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { Subject } from "rxjs"
import type { Class } from "type-fest"
import { COMMAND_HANDLER_METADATA, COMMAND_METADATA } from "./decorators/constants"
import { DefaultCommandPubSub } from "./default-command-publisher"
import { CommandHandlerNotFoundException } from "./exceptions/command-handler-not-found.exception"
import { InvalidCommandHandlerException } from "./exceptions/invalid-command-handler.exception"

export type CommandHandlerType = Class<ICommandHandler<Command, any>>

@singleton()
export class CommandBus<C extends Command = Command> implements ICommandBus {
  private readonly logger = createLogger(CommandBus.name)
  private subject = new Subject<Command>()
  private readonly publisher: ICommandPublisher = new DefaultCommandPubSub(this.subject)

  #handlers = new Map<string, ICommandHandler<C, any>>()

  execute<T extends C, R = any>(command: T): Promise<R> {
    try {
      const commandId = this.getCommandId(command)
      const handler = this.#handlers.get(commandId)
      if (!handler) {
        const commandName = this.getCommandName(command)
        throw new CommandHandlerNotFoundException(commandName)
      }
      this.publisher.publish(command)
      return handler.execute(command)
    } catch (error) {
      this.logger.error(error)
      throw error
    }
  }

  register(handlers: CommandHandlerType[] = [], c = container) {
    handlers.forEach((handler) => this.registerHandler(c, handler))
  }

  private bind<T extends C>(handler: ICommandHandler<T, any>, id: string) {
    this.#handlers.set(id, handler)
  }

  protected registerHandler(container: DependencyContainer, handler: CommandHandlerType) {
    const instance = container.resolve(handler)
    if (!instance) {
      return
    }
    const target = this.reflectCommandId(handler)
    if (!target) {
      throw new InvalidCommandHandlerException()
    }
    this.bind(instance as ICommandHandler<C, any>, target)
  }

  private reflectCommandId(handler: CommandHandlerType): string | undefined {
    const command: Command = Reflect.getMetadata(COMMAND_HANDLER_METADATA, handler)
    const commandMetadata: CommandMetadata = Reflect.getMetadata(COMMAND_METADATA, command)
    return commandMetadata.id
  }

  private getCommandId(command: C): string {
    const { constructor: commandType } = Object.getPrototypeOf(command)
    const commandMetadata: CommandMetadata = Reflect.getMetadata(COMMAND_METADATA, commandType)
    if (!commandMetadata) {
      throw new CommandHandlerNotFoundException(commandType.name)
    }

    return commandMetadata.id
  }

  private getCommandName(command: C): string {
    const { constructor } = Object.getPrototypeOf(command)
    return constructor.name as string
  }
}
