import pkg from "../../../package.json"
import { app } from "./app"

export const serve = async () => {
  app.listen(Bun.env.PORT ?? 4728, () => {
    app.decorator.logger.info(
      { version: pkg.version },
      `App is running at ${app.server?.hostname}:${app.server?.port}`, )
  })
}
