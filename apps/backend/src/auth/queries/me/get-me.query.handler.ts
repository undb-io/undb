import { IQueryHandler } from '@egodb/domain'
import { QueryHandler } from '@nestjs/cqrs'
import { GetMeResponseDTO } from '../../dtos/get-me.response.dto.js'
import { GetMeQuery } from './get-me.query.js'

@QueryHandler(GetMeQuery)
export class GetMeQueryHandler implements IQueryHandler<GetMeQuery, GetMeResponseDTO> {
  execute(query: GetMeQuery): Promise<GetMeResponseDTO> {
    return query.me
  }
}
