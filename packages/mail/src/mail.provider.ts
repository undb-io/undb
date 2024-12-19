import { inject } from "@undb/di"

export const MAIL_SERVICE = Symbol("MAIL_SERVICE")

export const injectMailService = () => inject(MAIL_SERVICE)
