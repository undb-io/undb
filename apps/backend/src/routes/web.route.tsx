import staticPlugin from "@elysiajs/static"
import Elysia from "elysia"

export const web = () => {
  return new Elysia()
    .use(staticPlugin({ indexHTML: true, prefix: "/", assets: "dist" }))
    .get("/t/*", () => Bun.file("dist/index.html"))
}
