import { IQueryUser, WithUserEmail } from '@egodb/core'
import { GetMeQuery, LoginCommand, RegisterCommand } from '@egodb/cqrs'
import { Injectable } from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import * as bcrypt from 'bcrypt'
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
    if (!user) return null

    const isPasswordMatch = await bcrypt.compare(pass, user.password)
    if (isPasswordMatch) return user.toQuery()
    return null
  }

  async register(email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10)
    return this.commandBus.execute(new RegisterCommand({ email, password: hashedPassword }))
  }

  async login(user: IQueryUser) {
    return this.commandBus.execute(new LoginCommand({ user }))
  }

  async me(user: IQueryUser) {
    return this.queryBus.execute(new GetMeQuery({ me: user }))
  }
}
