import { IQueryUser, WithUserEmail } from '@egodb/core'
import { GetMeQuery, LoginCommand } from '@egodb/cqrs'
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { UserService } from '../modules/user/user.service.js'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(WithUserEmail.fromString(email))
    // @ts-ignore
    if (user && user.password === pass) {
      // @ts-ignore
      const { password, ...result } = user
      return result
    }
    return null
  }

  async login(user: IQueryUser) {
    return this.commandBus.execute(new LoginCommand({ user }))
  }

  async me(user: IQueryUser) {
    return this.queryBus.execute(new GetMeQuery({ me: user }))
  }
}
