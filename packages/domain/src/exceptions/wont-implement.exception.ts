export class WontImplementException extends Error {
  constructor(name: string) {
    super(`${name} will not be implemented`)
  }
}
