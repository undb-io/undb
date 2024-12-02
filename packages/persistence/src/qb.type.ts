import type { Kysely, Transaction } from "kysely"
import type { Database } from "./db"
import type { createQueryBuilderWithDialect } from "./qb.util"

export type Tx = Transaction<Database>
export type AnonymousTx = Transaction<any>

export type IQueryBuilder = ReturnType<typeof createQueryBuilderWithDialect>
export type IRecordQueryBuilder = Kysely<any>
