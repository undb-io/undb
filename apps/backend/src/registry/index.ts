import { registerCommands } from "@undb/command-handlers"
import { registerQueries } from "@undb/query-handlers"

import { registerDb } from "./db.registry"
import { registerContext } from "./context.registry"

export const register = () => {
  registerContext()
  registerDb()
  registerCommands()
  registerQueries()
}
