import type { IQueryUser } from './user.type'
import type { UserId } from './value-objects/index.js'

export class User {
  public userId!: UserId
  public username!: string
  public email!: string
  public password!: string

  static empty() {
    return new User()
  }

  public toQuery(): IQueryUser {
    return {
      userId: this.userId.value,
      username: this.username,
      email: this.email,
    }
  }
}
