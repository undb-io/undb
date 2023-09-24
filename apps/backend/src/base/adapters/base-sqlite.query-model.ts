import { Inject, Injectable } from '@nestjs/common'

export const BASE_QUERY_MODEL = Symbol('BASE_QUERY_MODEL')

export const InjectBaseQueryModel = () => Inject(BASE_QUERY_MODEL)

@Injectable()
export class BaseSqliteQueryModel {}
