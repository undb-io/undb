import { type ISpaceMemberService, injectSpaceMemberService } from "@undb/authz"
import { setContextValue } from "@undb/context/server"
import { singleton } from "@undb/di"
import { type IQueryBuilder, getCurrentTransaction, injectQueryBuilder } from "@undb/persistence"
import { type ISpaceService, injectSpaceService } from "@undb/space"
import { Google, generateCodeVerifier } from "arctic"
import { env } from "bun"
import { Elysia } from "elysia"
import { type Lucia, generateIdFromEntropySize } from "lucia"
import { OAuth2RequestError, generateState } from "oslo/oauth2"
import { SPACE_ID_COOKIE_NAME } from "../../../constants"
import { withTransaction } from "../../../db"
import { injectLucia } from "../auth.provider"
import { injectGoogleProvider } from "./google.provider"

@singleton()
export class GoogleOAuth {
  constructor(
    @injectSpaceMemberService()
    private spaceMemberService: ISpaceMemberService,
    @injectQueryBuilder()
    private readonly queryBuilder: IQueryBuilder,
    @injectSpaceService()
    private readonly spaceService: ISpaceService,
    @injectGoogleProvider()
    private readonly google: Google,
    @injectLucia()
    private readonly lucia: Lucia,
  ) {}

  route() {
    return new Elysia()
      .get("/login/google", async (ctx) => {
        const state = generateState()
        const codeVerifier = generateCodeVerifier()
        const url = await this.google.createAuthorizationURL(state, codeVerifier, {
          scopes: ["email", "profile"],
        })

        ctx.cookie["state"].set({
          value: state,
          secure: env.NODE_ENV === "production",
          httpOnly: true,
          maxAge: 60 * 10,
          path: "/",
        })

        ctx.cookie["code_verifier"].set({
          value: codeVerifier,
          secure: env.NODE_ENV === "production",
          httpOnly: true,
          maxAge: 60 * 10,
          path: "/",
        })

        return ctx.redirect(url.toString(), 302)
      })
      .get("/login/google/callback", async (ctx) => {
        const storedState = ctx.cookie["state"]?.value ?? null
        const storedCodeVerifier = ctx.cookie["code_verifier"]?.value ?? null

        const url = new URL(ctx.request.url)
        const state = url.searchParams.get("state")
        const code = url.searchParams.get("code")

        // verify state
        if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
          return new Response(null, {
            status: 400,
          })
        }

        try {
          const tokens = await this.google.validateAuthorizationCode(code, storedCodeVerifier)
          const googleUserResponse = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          })
          const googleUserResult: GoogleUserResult = await googleUserResponse.json()

          const existingUser = await this.queryBuilder
            .selectFrom("undb_oauth_account")
            .selectAll()
            .where((eb) =>
              eb.and([
                eb.eb("provider_id", "=", "google"),
                eb.eb("provider_user_id", "=", googleUserResult.id.toString()),
              ]),
            )
            .executeTakeFirst()

          if (existingUser) {
            const session = await this.lucia.createSession(existingUser.user_id, {})
            const sessionCookie = this.lucia.createSessionCookie(session.id)
            return new Response(null, {
              status: 302,
              headers: {
                Location: "/",
                "Set-Cookie": sessionCookie.serialize(),
              },
            })
          }
          const existingGoogleUser = await this.queryBuilder
            .selectFrom("undb_user")
            .selectAll()
            .where("undb_user.email", "=", googleUserResult.email)
            .executeTakeFirst()

          if (existingGoogleUser) {
            const spaceId = ctx.cookie[SPACE_ID_COOKIE_NAME].value
            if (!spaceId) {
              await this.spaceService.setSpaceContext(setContextValue, { userId: existingGoogleUser.id })
            }

            await this.queryBuilder
              .insertInto("undb_oauth_account")
              .values({
                provider_id: "google",
                provider_user_id: googleUserResult.id.toString(),
                user_id: existingGoogleUser.id,
              })
              .execute()

            const session = await this.lucia.createSession(existingGoogleUser.id, {})
            const sessionCookie = this.lucia.createSessionCookie(session.id)
            return new Response(null, {
              status: 302,
              headers: {
                Location: "/",
                "Set-Cookie": sessionCookie.serialize(),
              },
            })
          }
          const userId = generateIdFromEntropySize(10) // 16 characters long
          await withTransaction(this.queryBuilder)(async () => {
            const tx = getCurrentTransaction()
            await tx
              .insertInto("undb_user")
              .values({
                id: userId,
                username: googleUserResult.name,
                avatar: googleUserResult.picture,
                email: googleUserResult.email,
                password: "",
                email_verified: true,
              })
              .execute()

            setContextValue("user", {
              userId,
              username: googleUserResult.name,
              email: "",
              emailVerified: false,
            })

            await tx
              .insertInto("undb_oauth_account")
              .values({
                user_id: userId,
                provider_id: "google",
                provider_user_id: googleUserResult.id.toString(),
              })
              .execute()
            const space = await this.spaceService.createPersonalSpace()
            await this.spaceMemberService.createMember(userId, space.id.value, "owner")
            ctx.cookie[SPACE_ID_COOKIE_NAME].set({ value: space.id.value })
          })
          const session = await this.lucia.createSession(userId, {})
          const sessionCookie = this.lucia.createSessionCookie(session.id)
          return new Response(null, {
            status: 302,
            headers: {
              Location: "/",
              "Set-Cookie": sessionCookie.serialize(),
            },
          })
        } catch (e) {
          console.log(e)
          if (e instanceof OAuth2RequestError) {
            // bad verification code, invalid credentials, etc
            return new Response(null, {
              status: 400,
            })
          }
          return new Response(null, {
            status: 500,
          })
        }
      })
  }
}

interface GoogleUserResult {
  id: number
  email: string
  verified_email: boolean
  name: string
  given_name: string
  picture: string
  locale: string
}
