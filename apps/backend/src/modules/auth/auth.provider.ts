import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite"
import { container, inject } from "@undb/di"
import { sqlite } from "@undb/persistence"
import { Lucia } from "lucia"

export const LUCIA_PROVIDER = Symbol.for("LUCIA_PROVIDER")

const adapter = new LibSQLAdapter(sqlite, {
  user: "undb_user",
  session: "undb_session",
})

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: Bun.env.NODE_ENV === "PRODUCTION", // set `Secure` flag in HTTPS
    },
  },
  getUserAttributes: (attributes) => {
    return {
      emailVerified: attributes.email_verified,
      email: attributes.email,
      username: attributes.username,
    }
  },
})

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: {
      email: string
      email_verified: boolean
      username: string
    }
  }
}

container.register(LUCIA_PROVIDER, { useValue: lucia })

export const injectLucia = () => inject(LUCIA_PROVIDER)
