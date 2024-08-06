import { container, inject, instanceCachingFactory } from "@undb/di"
import { env } from "@undb/env"
import { Google } from "arctic"

export const GOOGLE_PROVIDER = Symbol.for("GOOGLE_PROVIDER")

container.register(GOOGLE_PROVIDER, {
  useFactory: instanceCachingFactory(() => {
    const redirectURL = new URL("/login/google/callback", env.UNDB_BASE_URL)
    return new Google(env.GOOGLE_CLIENT_ID!, env.GOOGLE_CLIENT_SECRET!, redirectURL.toString())
  }),
})

export const injectGoogleProvider = () => inject(GOOGLE_PROVIDER)
