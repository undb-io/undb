import { Command } from './command'

export interface ICommandBus<TCommand extends Command = Command, TResult = any> {
  execute(command: TCommand): Promise<TResult>
}
