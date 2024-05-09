import { registerCommands } from '@undb/command-handlers'
import { registerQueries } from '@undb/query-handlers'

import { registerDb } from './db.registry'

export const register = () => {
  registerDb()
  registerCommands()
  registerQueries()
}
