import type { EmailEqual } from "./email-field.specification"

export interface IEmailFieldValueVisitor {
  emailEqual(s: EmailEqual): void
}
