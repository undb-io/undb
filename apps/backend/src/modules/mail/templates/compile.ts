import { Template } from "@undb/mail"
import Handlebars from "handlebars"

export async function compile(tpl: Template, data: any) {
  const file =
    Bun.env.NODE_ENV === "production"
      ? Bun.file(`./mail/templates/${tpl}.hbs`)
      : Bun.file(`./src/modules/mail/templates/${tpl}.hbs`)
  const text = await file.text()
  const template = Handlebars.compile(text)

  return template(data)
}
