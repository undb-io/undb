import Elysia from "elysia"

export const web = () => {
  return new Elysia().get("/t/*", () => Bun.file("dist/index.html"))
}
