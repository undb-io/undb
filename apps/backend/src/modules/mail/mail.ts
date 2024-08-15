import { singleton } from "@undb/di"
import { env } from "@undb/env"
import { createLogger } from "@undb/logger"
import { IMailService, ISendInput } from "@undb/mail"
import { createTransport } from "nodemailer"
import mg from "nodemailer-mailgun-transport"
import SMTPConnection from "nodemailer/lib/smtp-connection"
import { compile } from "./templates/compile"

function createMailerTransport() {
  if (env.UNDB_MAIL_PROVIDER === "nodemailer" || !env.UNDB_MAIL_PROVIDER) {
    const options: SMTPConnection.Options = {
      host: env.UNDB_MAIL_HOST,
      port: 465,
      // port: env.UNDB_MAIL_PORT ? parseInt(env.UNDB_MAIL_PORT, 10) : undefined,
      secure: env.UNDB_MAIL_SECURE,
      auth: {
        user: env.UNDB_MAIL_USER,
        pass: env.UNDB_MAIL_PASS,
      },
      debug: Bun.env.NODE_ENV !== "production",
    }

    return createTransport(options)
  }

  return createTransport(
    mg({
      auth: {
        api_key: env.UNDB_MAILGUN_API_KEY!,
        domain: env.UNDB_MAILGUN_DOMAIN!,
      },
    }),
  )
}

@singleton()
export class NodemailerService implements IMailService {
  logger = createLogger(NodemailerService.name)
  private readonly transport = createMailerTransport()

  async send(input: ISendInput): Promise<void> {
    const html = await compile(input.template, input.data)
    await this.transport.sendMail({
      from: input.from || env.UNDB_MAIL_DEFAULT_FROM,
      to: input.to,
      subject: input.subject,
      html,
    })
  }
}
