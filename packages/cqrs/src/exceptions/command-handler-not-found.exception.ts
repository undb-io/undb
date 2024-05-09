export class CommandHandlerNotFoundException extends Error {
  constructor(commandName: string) {
    super(`The command handler for the "${commandName}" command was not found!`)
  }
}
