import { Command } from '@egodb/domain'
import { User } from '../../../users/users.service'
import { LoginDTO } from '../../dtos/login.dto'

export class LoginCommand extends Command implements LoginDTO {
  constructor(public readonly user: User) {
    super({})
  }
}
