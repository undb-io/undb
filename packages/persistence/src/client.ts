import { createClient } from "@libsql/client"

export const sqlite = createClient({
  url: "libsql://localhost:8080?tls=0",
})
