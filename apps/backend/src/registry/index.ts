import { registerCommands } from "@undb/command-handlers"
import { registerQueries } from "@undb/query-handlers"

import { registerEvents } from "@undb/event-handlers"
import { registerWebhook } from "../modules"
import { registerStorage } from "../modules/file/storage"
import { registerMail } from "../modules/mail/mail.register"
import { registerContext } from "./context.registry"
import { registerDb } from "./db.registry"

export const register = () => {
  registerMail()
  registerStorage()
  registerContext()
  registerDb()
  registerCommands()
  registerEvents()
  registerQueries()
  registerWebhook()
}
