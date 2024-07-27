import { createClient } from "@libsql/client"

export const sqlite = createClient({
  url: "http://127.0.0.1:8080",
})
