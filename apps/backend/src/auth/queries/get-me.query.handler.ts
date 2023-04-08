import { GetMeQuery, GetMeQueryHandler } from '@egodb/cqrs'
import { QueryHandler } from '@nestjs/cqrs'

@QueryHandler(GetMeQuery)
export class NestGetMeQueryHandler extends GetMeQueryHandler {}
