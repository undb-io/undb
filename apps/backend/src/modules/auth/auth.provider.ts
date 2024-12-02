import { BunSQLiteAdapter, LibSQLAdapter } from "@lucia-auth/adapter-sqlite"
import { container, inject, instanceCachingFactory } from "@undb/di"
import { env } from "@undb/env"
import { Client, SQLITE_CLIENT } from "@undb/persistence/server"
import Database from "bun:sqlite"
import { Adapter, Lucia } from "lucia"

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
        spaceId: attributes.space_id,
      }
    },
    getUserAttributes: (attributes) => {
      return {
        emailVerified: Boolean(attributes.email_verified),
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

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof createTursoLucia>
    DatabaseSessionAttributes: DatabaseSessionAttributes
    DatabaseUserAttributes: {
      email: string
      email_verified: boolean
      username: string
      avatar?: string
    }
  }
  interface DatabaseSessionAttributes {
    space_id: string
  }
}

container.register(LUCIA_PROVIDER, {
  useFactory: instanceCachingFactory((c) => {
    if (env.UNDB_DB_PROVIDER === "sqlite" || !env.UNDB_DB_PROVIDER) {
      const sqlite = c.resolve<Database>(SQLITE_CLIENT)
      return createSqliteLucia(sqlite)
    }
    const sqlite = c.resolve<Client>(SQLITE_CLIENT)
    return createTursoLucia(sqlite)
  }),
})
