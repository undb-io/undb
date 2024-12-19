import type { ISendInput } from "./mail.dto"

export interface IMailService {
  send(input: ISendInput): Promise<void>
}
