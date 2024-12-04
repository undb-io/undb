import { container, inject, instanceCachingFactory } from "@undb/di"
import { env } from "@undb/env"
import { GitHub } from "arctic"

export const GITHUB_PROVIDER = Symbol.for("GITHUB_PROVIDER")

container.register(GITHUB_PROVIDER, {
  useFactory: instanceCachingFactory(() => {
    const redirectURL = new URL("/login/github/callback", env.UNDB_BASE_URL)
    return new GitHub(env.GITHUB_CLIENT_ID!, env.GITHUB_CLIENT_SECRET!, redirectURL.toString())
  }),
})

export const injectGithubProvider = () => inject(GITHUB_PROVIDER)
