import { app } from "./app"

export const serve = async () => {
  app.listen(Bun.env.PORT ?? 4728, () => {
    app.decorator.logger.info(`App is running at ${app.server?.hostname}:${app.server?.port}`)
  })
}
