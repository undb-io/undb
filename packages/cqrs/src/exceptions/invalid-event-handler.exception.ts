export class InvalidEventHandlerException extends Error {
  constructor() {
    super(`Invalid event handler exception (missing @eventHandler() decorator?)`)
  }
}
