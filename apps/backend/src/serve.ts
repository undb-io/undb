import { app } from "./app"

export const serve = async () => {
  await app.listen(Bun.env.PORT ?? 4000, () => {
    app.decorator.logger.info(`App is running at ${app.server?.hostname}:${app.server?.port}`)
  })
}
