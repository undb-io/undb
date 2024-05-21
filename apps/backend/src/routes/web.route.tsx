import { executionContext } from "@undb/context/server"
import Elysia from "elysia"

export const web = () => {
  return new Elysia().guard(
    {
      beforeHandle(context) {
        const user = executionContext.getStore()?.user
        if (!user) {
          return context.redirect("/signup", 301)
        }
      },
    },
    (app) => app.get("/", () => Bun.file("dist/index.html")).get("/t/*", () => Bun.file("dist/index.html")),
  )
}
