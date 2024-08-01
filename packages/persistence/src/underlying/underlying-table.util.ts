import type { IRollupFn } from "@undb/table"
import { match } from "ts-pattern"

export function getRollupFn(fn: IRollupFn): string {
  return match(fn)
    .with("lookup", () => "json_group_array")
    .with("average", () => "avg")
    .with("sum", () => "sum")
    .with("count", () => "count")
    .with("max", () => "max")
    .with("min", () => "min")
    .exhaustive()
}
