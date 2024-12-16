import { singleton } from "@undb/di"
import Elysia from "elysia"

@singleton()
export class AuthOpenAPI {
  constructor() {}

  public route(app: Elysia<any>) {
    return app.get("/auth-with-password", () => {
      return "Hello World"
    })
  }
}
