import { singleton } from "@undb/di"
import Elysia from "elysia"

@singleton()
export class Web {
  route() {
    return new Elysia().get("/", () => Bun.file("dist/index.html")).get("/t/*", () => Bun.file("dist/index.html"))
  }
}
