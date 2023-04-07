import { IQueryUser } from '@egodb/core'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UserService {
  private readonly users = [
    {
      userId: '1',
      username: 'john',
      password: 'changeme',
    },
    {
      userId: '2',
      username: 'maria',
      password: 'guess',
    },
  ]

  async findOne(id: string): Promise<IQueryUser | undefined> {
    return this.users.find((user) => user.userId === id)
  }
}
