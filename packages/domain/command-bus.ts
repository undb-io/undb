import type { Command } from './command'

export interface ICommandBus<TCommand extends Command = Command> {
  execute<TResult>(command: TCommand): Promise<TResult>
}
