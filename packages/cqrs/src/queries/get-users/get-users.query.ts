import { Query } from '@undb/domain'
import type { IGetUsersQuery } from './get-users.query.interface.js'

export class GetUsersQuery extends Query implements IGetUsersQuery {}
