import type { Command } from "./command"

export interface ICommandPublisher<C extends Command = Command> {
  publish<T extends C = C>(command: T): any
}
