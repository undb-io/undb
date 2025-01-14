import { inject, singleton } from "@undb/di"
import { match } from "ts-pattern"
import { DbProviderService, type IDbProvider } from "../db.provider"

export interface IDatabaseFnUtil {
  get jsonGroupArray(): string
  get jsonObject(): string
  get jsonArray(): string
}

@singleton()
export class DatabaseFnUtil implements IDatabaseFnUtil {
  constructor(@inject(DbProviderService) private readonly dbProvider: IDbProvider) {}

  get jsonGroupArray() {
    return match(this.dbProvider)
      .when(
        (p) => p.isPostgres(),
        () => "json_agg",
      )
      .otherwise(() => "json_group_array")
  }

  get jsonObject() {
    return match(this.dbProvider)
      .when(
        (p) => p.isPostgres(),
        () => "json_build_object",
      )
      .otherwise(() => "json_object")
  }

  get jsonArray() {
    return match(this.dbProvider)
      .when(
        (p) => p.isPostgres(),
        () => "json_build_array",
      )
      .otherwise(() => "json_array")
  }
}
