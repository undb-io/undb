import { registerCommands } from "@undb/command-handlers"
import { registerQueries } from "@undb/query-handlers"

import { registerWebhook } from "../modules"
import { registerStorage } from "../modules/file/storage"
import { registerContext } from "./context.registry"
import { registerDb } from "./db.registry"

export const register = () => {
  registerStorage()
  registerContext()
  registerDb()
  registerCommands()
  registerQueries()
  registerWebhook()
}
