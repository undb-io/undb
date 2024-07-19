import { container } from "@undb/di"
import { MAIL_SERVICE } from "@undb/mail"
import { NodemailerService } from "./mail"

export const registerMail = () => {
  container.register(MAIL_SERVICE, NodemailerService)
}
