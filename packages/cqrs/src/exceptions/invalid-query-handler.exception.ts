export class InvalidQueryHandlerException extends Error {
  constructor() {
    super(`Invalid query handler exception (missing @queryHandler() decorator?)`)
  }
}
