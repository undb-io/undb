import type {
  StringContains,
  StringEmpty,
  StringEndsWith,
  StringEqual,
  StringStartsWith,
} from './string-field-value.specification'

export interface IStringFieldValueVisitor {
  stringEqual(spec: StringEqual): void
  stringContains(spec: StringContains): void
  stringStartsWith(spec: StringStartsWith): void
  stringEndsWith(spec: StringEndsWith): void
  stringEmpty(spec: StringEmpty): void
}
