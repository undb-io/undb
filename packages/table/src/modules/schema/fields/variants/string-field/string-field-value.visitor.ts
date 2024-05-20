import type {
  StringContains,
  StringEmpty,
  StringEndsWith,
  StringEqual,
  StringMax,
  StringMin,
  StringStartsWith,
} from "./string-field-value.specification"

export interface IStringFieldValueVisitor {
  stringEqual(spec: StringEqual): void
  stringContains(spec: StringContains): void
  stringStartsWith(spec: StringStartsWith): void
  stringEndsWith(spec: StringEndsWith): void
  stringEmpty(spec: StringEmpty): void
  stringMin(spec: StringMin): void
  stringMax(spec: StringMax): void
}
