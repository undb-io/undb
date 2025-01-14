import { singleton } from "@undb/di"
import { match } from "ts-pattern"
import { injectDbProvider } from "../db.provider"

export interface IDatabaseFnUtil {
  get jsonGroupArray(): string
  get jsonObject(): string
  get jsonArray(): string
}

@singleton()
export class DatabaseFnUtil implements IDatabaseFnUtil {
  constructor(@injectDbProvider() private readonly dbProvider: string) {}

  get jsonGroupArray() {
    return match(this.dbProvider)
      .with("postgres", () => "json_agg")
      .otherwise(() => "json_group_array")
  }

  get jsonObject() {
    return match(this.dbProvider)
      .with("postgres", () => "json_build_object")
      .otherwise(() => "json_object")
  }

  get jsonArray() {
    return match(this.dbProvider)
      .with("postgres", () => "json_build_array")
      .otherwise(() => "json_array")
  }
}
