import Elysia from "elysia"

export const web = () => {
  return new Elysia().get("/", () => Bun.file("dist/index.html")).get("/t/*", () => Bun.file("dist/index.html"))
}
