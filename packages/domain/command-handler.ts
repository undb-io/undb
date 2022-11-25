import type { Command } from './command'

export interface ICommandHandler<TCommand extends Command, TResult> {
  execute(command: TCommand): Promise<TResult>
}
