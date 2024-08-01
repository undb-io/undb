export class QueryHandlerNotFoundException extends Error {
  constructor(queryName: string) {
    super(`The query handler for the "${queryName}" query was not found!`)
  }
}
