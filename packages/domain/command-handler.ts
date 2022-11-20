import { Command } from './command'

export interface ICommandHandler<TCommand extends Command = any, TResult = any> {
  execute(command: TCommand): Promise<TResult>
}
