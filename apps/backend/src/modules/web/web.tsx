import staticPlugin from "@elysiajs/static"
import { singleton } from "@undb/di"
import Elysia from "elysia"

@singleton()
export class Web {
  route() {
    return new Elysia()
      .use(staticPlugin({ prefix: "/", assets: "dist" }))
      .use(staticPlugin({ prefix: "/assets", assets: "assets" }))
      .get("/", () => Bun.file("dist/index.html"))
      .get("/t/*", () => Bun.file("dist/index.html"))
      .get("/s/*", () => Bun.file("dist/index.html"))
      .get("/bases/*", () => Bun.file("dist/index.html"))
      .get("/account/*", () => Bun.file("dist/index.html"))
      .get("/members/*", () => Bun.file("dist/index.html"))
  }
}
