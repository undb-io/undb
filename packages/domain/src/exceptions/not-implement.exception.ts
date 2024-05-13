export class NotImplementException extends Error {
  constructor(name: string) {
    super(`${name} not implemented yet`)
  }
}
