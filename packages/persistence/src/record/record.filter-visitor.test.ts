import { Filter, Schema, type IFilterGroup } from "@undb/table"
import Database from "bun:sqlite"
import { describe, expect, test } from "bun:test"
import { Kysely } from "kysely"
import { BunSqliteDialect } from "kysely-bun-sqlite"
import type { IQueryBuilder } from "../qb"
import { RecordFilterVisitor } from "./record.filter-visitor"

const schema = Schema.fromJSON([
  { id: "field1", type: "string", name: "field1" },
  { id: "field2", type: "number", name: "field2" },
])

const sqlite = new Database()
const qb = new Kysely({
  dialect: new BunSqliteDialect({
    database: sqlite,
  }),
}) satisfies IQueryBuilder

describe("record.filter-visitor", () => {
  test.each<IFilterGroup>([
    {
      conjunction: "and",
      children: [
        { fieldId: "field1", op: "eq", value: "value1" },
        { fieldId: "field2", op: "gt", value: 1 },
      ],
    },
    {
      conjunction: "or",
      children: [
        { fieldId: "field1", op: "eq", value: "value1" },
        {
          conjunction: "and",
          children: [
            { fieldId: "field1", op: "eq", value: "value1" },
            { fieldId: "field2", op: "gt", value: 1 },
          ],
        },
        {
          conjunction: "or",
          children: [
            { fieldId: "field1", op: "eq", value: "value2" },
            { fieldId: "field2", op: "lt", value: 2 },
          ],
        },
      ],
    },
    {
      conjunction: "and",
      children: [
        { fieldId: "field1", op: "starts_with", value: "value1" },
        { fieldId: "field1", op: "ends_with", value: "value2" },
        { fieldId: "field1", op: "contains", value: "value3" },
        { fieldId: "field2", op: "eq", value: 1 },
        { fieldId: "field2", op: "gt", value: 2 },
        { fieldId: "field2", op: "gte", value: 3 },
        { fieldId: "field2", op: "lt", value: 4 },
        { fieldId: "field2", op: "lte", value: 5 },
      ],
    },
    {
      conjunction: "and",
      children: [{ fieldId: "field1", op: "is_empty" }],
    },
    {
      conjunction: "and",
      children: [{ fieldId: "field1", op: "is_not_empty" }],
    },
    {
      conjunction: "and",
      children: [{ fieldId: "field1", op: "starts_with", value: "hello" }],
    },
    {
      conjunction: "and",
      children: [{ fieldId: "field1", op: "contains", value: "hello" }],
    },
    {
      conjunction: "and",
      children: [{ fieldId: "field1", op: "does_not_contain", value: "hello" }],
    },
    {
      conjunction: "and",
      children: [{ fieldId: "field1", op: "ends_with", value: "hello" }],
    },
    {
      conjunction: "and",
      children: [{ fieldId: "field2", op: "is_empty" }],
    },
    {
      conjunction: "and",
      children: [{ fieldId: "field2", op: "is_not_empty" }],
    },
  ])("should get query", (filter) => {
    const f = new Filter(filter)
    const spec = f.getSpec(schema)

    const query = qb
      .selectFrom("table")
      .selectAll()
      .where((eb) => {
        const visitor = new RecordFilterVisitor(eb)
        if (spec.isSome()) {
          spec.unwrap().accept(visitor)
        }

        return visitor.cond
      })
      .compile()

    expect(query.sql).toMatchSnapshot()
    expect(query.parameters).toMatchSnapshot()
  })
})
