import { NestGetBaseByIdQueryHandler } from './get-base-by-id.query-handler.js'
import { NestGetBasesQueryHandler } from './get-bases.query-handler.js'

export const queries = [NestGetBasesQueryHandler, NestGetBaseByIdQueryHandler]
