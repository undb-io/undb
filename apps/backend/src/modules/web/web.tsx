import staticPlugin from "@elysiajs/static"
import { singleton } from "@undb/di"
import { env } from "@undb/env"
import Elysia from "elysia"

@singleton()
export class Web {
  route() {
    const index = Bun.file("dist/index.html")
    return new Elysia()
      .use(staticPlugin({ prefix: "/", assets: "dist" }))
      .use(staticPlugin({ prefix: "/assets", assets: "assets" }))
      .get("/", () => index)
      .get("/t/*", () => index)
      .get("/s/*", () => index)
      .get("/bases/*", () => index)
      .get("/account/*", () => index)
      .get("/settings", () => index)
      .get("/login", () => index)
      .get("/signup", (ctx) => {
        if (env.UNDB_DISABLE_REGISTRATION) {
          ctx.redirect("/login", 302)
          return
        }
        return index
      })
      .get("/verify-email", () => index)
      .get("/reset-password/*", () => index)
      .get("/create-from-share/*", () => index)
  }
}
