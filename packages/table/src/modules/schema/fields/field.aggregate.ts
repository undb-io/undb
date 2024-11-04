import type { z } from "@undb/zod"
import { abstractDateAggregate } from "./variants/abstractions/abstract-date.aggregate"
import { abstractNumberAggregate } from "./variants/abstractions/abstract-number.aggregate"
import { abstractUserAggregate } from "./variants/abstractions/abstract-user.aggregate"
import { checkboxFieldAggregate } from "./variants/checkbox-field/checkbox-field.aggregate"
import { currencyFieldAggregate } from "./variants/currency-field/currency-field.aggregate"
import { dateRangeFieldAggregate } from "./variants/date-range-field/date-range-field.aggregate"
import { durationFieldAggregate } from "./variants/duration-field/duration-field.aggregate"
import { emailFieldAggregate } from "./variants/email-field/email-field.aggregate"
import { jsonFieldAggregate } from "./variants/json-field/json-field.aggregate"
import { longTextFieldAggregate } from "./variants/long-text-field/long-text-field.aggregate"
import { percentageFieldAggregate } from "./variants/percentage-field/percentage-field.aggregate"
import { referenceFieldAggregate } from "./variants/reference-field/reference-field.aggregate"
import { rollupFieldAggregate } from "./variants/rollup-field/rollup-field.aggregate"
import { stringFieldAggregate } from "./variants/string-field/string-field.aggregate"
import { urlFieldAggregate } from "./variants/url-field/url-field.aggregate"
import { userFieldAggregate } from "./variants/user-field/user-field.aggregate"

export const fieldAggregate = stringFieldAggregate
  .or(rollupFieldAggregate)
  .or(referenceFieldAggregate)
  .or(abstractNumberAggregate)
  .or(abstractDateAggregate)
  .or(abstractUserAggregate)
  .or(emailFieldAggregate)
  .or(urlFieldAggregate)
  .or(jsonFieldAggregate)
  .or(checkboxFieldAggregate)
  .or(userFieldAggregate)
  .or(longTextFieldAggregate)
  .or(currencyFieldAggregate)
  .or(durationFieldAggregate)
  .or(percentageFieldAggregate)
  .or(dateRangeFieldAggregate)

export type IFieldAggregate = z.infer<typeof fieldAggregate>
