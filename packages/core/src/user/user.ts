export interface IQueryUser {
  username: string
}

export class User {
  constructor(public readonly username: string) {}
}
