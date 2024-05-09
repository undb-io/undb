import type { Command } from './command.js'

export interface ICommandHandler<TCommand extends Command, TResult> {
  execute(command: TCommand): Promise<TResult>
}
