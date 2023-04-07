import { Query } from '@egodb/domain'
import { User } from '../../../modules/user/user.service.js'
import { GetMeDTO } from '../../dtos/get-me.dto.js'

export class GetMeQuery extends Query implements GetMeDTO {
  constructor(public readonly me: User) {
    super()
  }
}
