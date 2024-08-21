import { referenceFieldAggregate, rollupFieldAggregate } from "./variants"
import { abstractDateAggregate } from "./variants/abstractions/abstract-date.aggregate"
import { abstractNumberAggregate } from "./variants/abstractions/abstract-number.aggregate"
import { abstractUserAggregate } from "./variants/abstractions/abstract-user.aggregate"
import { checkboxFieldAggregate } from "./variants/checkbox-field/checkbox-field.aggregate"
import { emailFieldAggregate } from "./variants/email-field/email-field.aggregate"
import { jsonFieldAggregate } from "./variants/json-field/json-field.aggregate"
import { longTextFieldAggregate } from "./variants/long-text-field/long-text-field.aggregate"
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
