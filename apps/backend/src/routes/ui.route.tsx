import { Test, UI } from "@undb/ui"
import Elysia from "elysia"

export const ui = () => {
  return new Elysia().group("app", (app) => {
    return app.get("test", () => <UI />).get("test/1", () => <Test />)
  })
}
