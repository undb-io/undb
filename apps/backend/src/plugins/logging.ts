import { createLogger } from "@undb/logger"
import Elysia from "elysia"
import pkg from "../../package.json"

export const loggerPlugin = () => new Elysia().decorate("logger", createLogger(pkg.name))
