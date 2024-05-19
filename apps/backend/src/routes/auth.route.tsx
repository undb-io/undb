import { hash, verify } from "@node-rs/argon2"
import { adapter, db, users } from "@undb/persistence"
import { eq } from "drizzle-orm"
import { Context, Elysia, t } from "elysia"
import type { Session, User } from "lucia"
import { Lucia, generateIdFromEntropySize, verifyRequestOrigin } from "lucia"
import { SignUp } from "@undb/ui"

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: Bun.env.NODE_ENV === "PRODUCTION", // set `Secure` flag in HTTPS
    },
  },
  getUserAttributes: (attributes) => {
    return {
      // we don't need to expose the password hash!
      email: attributes.email,
    }
  },
})

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: {
      email: string
    }
  }
}

export const authStore = async (
  context: Context,
): Promise<{
  user: User | null
  session: Session | null
}> => {
  // CSRF check
  if (context.request.method !== "GET") {
    const originHeader = context.request.headers.get("Origin")
    // NOTE: You may need to use `X-Forwarded-Host` instead
    const hostHeader = context.request.headers.get("Host")
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
      return {
        user: null,
        session: null,
      }
    }
  }

  // use headers instead of Cookie API to prevent type coercion
  const cookieHeader = context.request.headers.get("Cookie") ?? ""
  const sessionId = lucia.readSessionCookie(cookieHeader)

  if (!sessionId) {
    return {
      user: null,
      session: null,
    }
  }

  const { session, user } = await lucia.validateSession(sessionId)
  if (session && session.fresh) {
    const sessionCookie = lucia.createSessionCookie(session.id)
    context.cookie[sessionCookie.name].set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    })
  }
  if (!session) {
    const sessionCookie = lucia.createBlankSessionCookie()
    context.cookie[sessionCookie.name].set({
      value: sessionCookie.value,
      ...sessionCookie.attributes,
    })
  }
  return {
    user,
    session,
  }
}

export const auth = () => {
  return new Elysia()
    .get("/signup", () => <SignUp />)
    .post(
      "/signup",
      async (ctx) => {
        const email = ctx.body.email
        const password = ctx.body.password

        const passwordHash = await hash(password, {
          // recommended minimum parameters
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        })
        const userId = generateIdFromEntropySize(10) // 16 characters long

        try {
          await db.insert(users).values({
            email,
            id: userId,
            password: passwordHash,
          })

          const session = await lucia.createSession(userId, {})
          const sessionCookie = lucia.createSessionCookie(session.id)
          return new Response(null, {
            status: 302,
            headers: {
              Location: "/",
              "Set-Cookie": sessionCookie.serialize(),
            },
          })
        } catch (e) {
          return new Response((e as Error).message, {
            status: 400,
          })
        }
      },
      {
        body: t.Object({
          email: t.String({ format: "email" }),
          password: t.String(),
        }),
      },
    )
    .post(
      "/api/login",
      async (ctx) => {
        const email = ctx.body.email
        const password = ctx.body.password

        const user = (await db.select().from(users).where(eq(users.email, email)).limit(1)).at(0)

        if (!user) {
          // NOTE:
          // Returning immediately allows malicious actors to figure out valid emails from response times,
          // allowing them to only focus on guessing passwords in brute-force attacks.
          // As a preventive measure, you may want to hash passwords even for invalid emails.
          // However, valid emails can be already be revealed with the signup page
          // and a similar timing issue can likely be found in password reset implementation.
          // It will also be much more resource intensive.
          // Since protecting against this is non-trivial,
          // it is crucial your implementation is protected against brute-force attacks with login throttling etc.
          // If emails/usernames are public, you may outright tell the user that the username is invalid.
          return new Response("Invalid email or password", {
            status: 400,
          })
        }

        const validPassword = await verify(user.password, password, {
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        })
        if (!validPassword) {
          return new Response("Invalid email or password", {
            status: 400,
          })
        }

        const session = await lucia.createSession(user.id, {})
        const sessionCookie = lucia.createSessionCookie(session.id)
        return new Response(null, {
          status: 302,
          headers: {
            Location: "/",
            "Set-Cookie": sessionCookie.serialize(),
          },
        })
      },
      {
        body: t.Object({
          email: t.String({ format: "email" }),
          password: t.String(),
        }),
      },
    )
}
