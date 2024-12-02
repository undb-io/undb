import type { Transaction } from "kysely"
import type { Database } from "./db"

export type Tx = Transaction<Database>
export type AnonymousTx = Transaction<any>
