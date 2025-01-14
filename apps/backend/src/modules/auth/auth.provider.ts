import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle"
import { BunSQLiteAdapter, LibSQLAdapter } from "@lucia-auth/adapter-sqlite"
import { container, inject, instanceCachingFactory } from "@undb/di"
import { Client, DATABASE_CLIENT, DB_PROVIDER, pgSessionTable, pgUsers } from "@undb/persistence/server"
import Database from "bun:sqlite"
import { drizzle } from "drizzle-orm/node-postgres"
import { Adapter, Lucia } from "lucia"
import pg from "pg"

export const LUCIA_PROVIDER = Symbol.for("LUCIA_PROVIDER")
export const injectLucia = () => inject(LUCIA_PROVIDER)

const createLuciaWithAdapter = (adapter: Adapter) => {
  const lucia = new Lucia(adapter, {
    sessionCookie: {
      name: "undb_auth_session",
      attributes: {
        secure: Bun.env.NODE_ENV === "PRODUCTION", // set `Secure` flag in HTTPS
        domain: Bun.env.UNDB_COOKIE_DOMAIN,
      },
    },
    getSessionAttributes: (attributes) => {
      return {
        spaceId: attributes.space_id ?? attributes.spaceId,
      }
    },
    getUserAttributes: (attributes) => {
      return {
        emailVerified: Boolean(attributes.email_verified || attributes.emailVerified),
        email: attributes.email,
        username: attributes.username,
        avatar: attributes.avatar,
      }
    },
  })

  return lucia
}

const createTursoLucia = (sqlite: Client) => {
  const adapter = new LibSQLAdapter(sqlite, {
    user: "undb_user",
    session: "undb_session",
  })

  return createLuciaWithAdapter(adapter)
}

const createSqliteLucia = (sqlite: Database) => {
  const adapter = new BunSQLiteAdapter(sqlite, {
    user: "undb_user",
    session: "undb_session",
  })

  return createLuciaWithAdapter(adapter)
}

const createPostgresLucia = (pool: pg.Pool) => {
  const db = drizzle(pool)

  const adapter = new DrizzlePostgreSQLAdapter(db, pgSessionTable, pgUsers)

  return createLuciaWithAdapter(adapter)
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof createTursoLucia>
    DatabaseSessionAttributes: DatabaseSessionAttributes
    DatabaseUserAttributes: {
      email: string
      email_verified: boolean
      emailVerified: boolean
      username: string
      avatar?: string
    }
  }
  interface DatabaseSessionAttributes {
    space_id: string
    spaceId: string
  }
}

container.register(LUCIA_PROVIDER, {
  useFactory: instanceCachingFactory((c) => {
    const dbProvider = c.resolve<string>(DB_PROVIDER)
    if (dbProvider === "sqlite" || !dbProvider) {
      const sqlite = c.resolve<Database>(DATABASE_CLIENT)
      return createSqliteLucia(sqlite)
    } else if (dbProvider === "postgres") {
      const pool = c.resolve<pg.Pool>(DATABASE_CLIENT)
      return createPostgresLucia(pool)
    }

    const sqlite = c.resolve<Client>(DATABASE_CLIENT)
    return createTursoLucia(sqlite)
  }),
})
