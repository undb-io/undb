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

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
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

container.register(LUCIA_PROVIDER, { useValue: lucia })

export const injectLucia = () => inject(LUCIA_PROVIDER)
