import { describe, expect, test } from "bun:test"
import { Schema } from "../.."
import type { IConditionGroup, MaybeConditionGroup } from "./condition.type"
import { getSpec, parseValidCondition } from "./condition.util"

const schema = Schema.fromJSON([
  { id: "fld_1", type: "string", name: "fld_1" },
  { id: "fld_2", type: "number", name: "fld_2" },
])

describe("condition.util", () => {
  test.each<IConditionGroup>([
    {
      conjunction: "and",
      children: [
        { fieldId: "fld_1", op: "eq", value: "value1" },
        { fieldId: "fld_2", op: "gt", value: 1 },
      ],
    },
    {
      conjunction: "or",
      children: [
        { fieldId: "fld_1", op: "eq", value: "value1" },
        {
          conjunction: "and",
          children: [
            { fieldId: "fld_1", op: "eq", value: "value1" },
            { fieldId: "fld_2", op: "gt", value: 1 },
          ],
        },
        {
          conjunction: "or",
          children: [
            { fieldId: "fld_1", op: "eq", value: "value2" },
            { fieldId: "fld_2", op: "lt", value: 2 },
          ],
        },
      ],
    },
  ])("should get correct spec", (condition) => {
    const spec = getSpec(schema.fieldMapById, condition)
    expect(spec).toMatchSnapshot()
  })

  describe("parseValidCondition", () => {
    test.each<IConditionGroup>([
      {
        conjunction: "and",
        children: [
          { fieldId: "fld_1", op: "eq", value: "value1" },
          { fieldId: "fld_2", op: "gt", value: 1 },
        ],
      },
      {
        conjunction: "or",
        children: [
          { fieldId: "fld_1", op: "eq", value: "value1" },
          {
            conjunction: "and",
            children: [
              { fieldId: "fld_1", op: "eq", value: "value1" },
              { fieldId: "fld_2", op: "gt", value: 1 },
            ],
          },
          {
            conjunction: "or",
            children: [
              { fieldId: "fld_1", op: "eq", value: "value2" },
              { fieldId: "fld_2", op: "lt", value: 2 },
            ],
          },
        ],
      },
    ])("should parse valid condition", (condition) => {
      const parsed = parseValidCondition(schema.fieldMapById, condition)
      expect(parsed).toEqual(condition)
    })

    test.each<[MaybeConditionGroup, IConditionGroup]>([
      [
        {
          id: "1",
          conjunction: "and",
          children: [
            { id: "2", fieldId: "fld_1", op: "eq", value: "value1" },
            { id: "3", fieldId: "fld_2", op: "gt", value: "1" },
          ],
        },
        {
          id: "5",
          conjunction: "and",
          children: [{ id: "6", fieldId: "fld_1", op: "eq", value: "value1" }],
        },
      ],
      [
        {
          conjunction: "or",
          children: [
            { fieldId: "fld_1", op: "eq", value: "value1" },
            {
              conjunction: "and",
              children: [
                { fieldId: "fld_1", op: "eq", value: "value1" },
                { fieldId: "fld_2", op: "gt", value: "1" },
              ],
            },
            {
              conjunction: "or",
              children: [
                { fieldId: "fld_1", value: "value2" },
                { fieldId: "fld_2", op: "lt", value: 2 },
              ],
            },
          ],
        },
        {
          conjunction: "or",
          children: [
            { fieldId: "fld_1", op: "eq", value: "value1" },
            {
              conjunction: "and",
              children: [{ fieldId: "fld_1", op: "eq", value: "value1" }],
            },
            {
              conjunction: "or",
              children: [{ fieldId: "fld_2", op: "lt", value: 2 }],
            },
          ],
        },
      ],
    ])("should ignore invalid condition", (condition, value) => {
      const parsed = parseValidCondition(schema.fieldMapById, condition)
      expect(parsed).toEqual(value)
    })
  })
})
