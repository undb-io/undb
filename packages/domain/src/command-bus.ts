import type { Command } from './command.js'

export interface ICommandBus<TCommand extends Command = Command> {
  execute<TResult>(command: TCommand): Promise<TResult>
}
