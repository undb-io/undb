import { container, singleton } from "@undb/di"
import Elysia from "elysia"
import { GithubOAuth } from "./github"
import { GoogleOAuth } from "./google"

@singleton()
export class OAuth {
  public route() {
    const github = container.resolve(GithubOAuth)
    const google = container.resolve(GoogleOAuth)
    return new Elysia().use(github.route()).use(google.route())
  }
}
