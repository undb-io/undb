import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { User, UserService } from '../modules/user/user.service.js'
import { LoginCommand } from './commands/index.js'
import { GetMeQuery } from './queries/index.js'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username)
    if (user && user.password === pass) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: User) {
    return this.commandBus.execute(new LoginCommand(user))
  }

  async me(user: User) {
    return this.queryBus.execute(new GetMeQuery(user))
  }
}
