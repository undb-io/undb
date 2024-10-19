export class EventHandlerNotFoundException extends Error {
  constructor(eventId: string) {
    super(`The event handler for the "${eventId}" event was not found!`)
  }
}
