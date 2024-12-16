import staticPlugin from "@elysiajs/static"
import { singleton } from "@undb/di"
import { env } from "@undb/env"
import Elysia from "elysia"

@singleton()
export class Web {
  route() {
    const cdnUrl = process.env.PUBLIC_CDN_URL
    const getAsset = async (path: string) => {
      if (cdnUrl) {
        const response = await fetch(`${cdnUrl}${path}`)
        return response.text()
      }
      return Bun.file(`dist${path}`).text()
    }

    const getIndex = () => getAsset("/index.html")

    return new Elysia()
      .use(staticPlugin({ prefix: "/", assets: "dist" }))
      .use(staticPlugin({ prefix: "/assets", assets: "assets" }))
      .get("/", () => getIndex())
      .get("/playground", () => getIndex())
      .get("/playground/*", () => getIndex())
      .get("/t/*", () => getIndex())
      .get("/dashboards/*", () => getIndex())
      .get("/s/*", () => getIndex())
      .get("/bases/*", () => getIndex())
      .get("/account/*", () => getIndex())
      .get("/settings", () => getIndex())
      .get("/login", () => getIndex())
      .get("/signup", async (ctx) => {
        if (env.UNDB_DISABLE_REGISTRATION) {
          ctx.redirect("/login", 302)
          return
        }
        return getIndex()
      })
      .get("/verify-email", () => getIndex())
      .get("/reset-password/*", () => getIndex())
      .get("/create-from-share/*", () => getIndex())
      .get("/templates/*", () => getIndex())
  }
}
