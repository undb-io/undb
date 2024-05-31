import { registerCommands } from "@undb/command-handlers"
import { registerQueries } from "@undb/query-handlers"

import { registerWebhook } from "../modules"
import { registerContext } from "./context.registry"
import { registerDb } from "./db.registry"

export const register = () => {
  registerContext()
  registerDb()
  registerCommands()
  registerQueries()
  registerWebhook()
}
