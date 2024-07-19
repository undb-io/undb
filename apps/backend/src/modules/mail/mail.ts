import { singleton } from "@undb/di"
import { env } from "@undb/env"
import { createLogger } from "@undb/logger"
import { IMailService } from "@undb/mail"
import { createTransport } from "nodemailer"
import { compile } from "./compile"

function createMailerTransport() {
  return createTransport({
    host: env.UNDB_MAIL_HOST,
    port: parseInt(env.UNDB_MAIL_PORT, 10),
  })
}

@singleton()
export class NodemailerService implements IMailService {
  logger = createLogger(NodemailerService.name)
  private readonly transport = createMailerTransport()

  async send(): Promise<void> {
    await this.transport.sendMail({
      from: '"undb" <no-reply@undb.xyz>',
      to: "nichenqin@hotmail.com",
      subject: "hello",
      html: await compile("invite"),
    })
  }
}
