import staticPlugin from "@elysiajs/static"
import { singleton } from "@undb/di"
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
      .get("/members/*", () => index)
      .get("/login", () => index)
      .get("/signup", () => index)
  }
}
