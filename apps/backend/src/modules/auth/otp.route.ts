import { inject, singleton } from "@undb/di"
import Elysia, { t } from "elysia"
import { type IOtpService, OtpService } from "./otp.service"

@singleton()
export class OtpRoute {
  constructor(
    @inject(OtpService)
    private readonly otpService: IOtpService,
  ) {}

  public route(app: Elysia<any>) {
    return app.group("/otp", (app) => app.use(this.requestOtp(app)).use(this.verifyOtp(app)))
  }

  private requestOtp(app: Elysia<any>) {
    return app.post(
      "/request",
      async (ctx) => {
        const email = ctx.body.email
        await this.otpService.sendOtp(email)
        return
      },
      {
        type: "json",
        body: t.Object({
          email: t.String({ format: "email" }),
        }),
      },
    )
  }

  private verifyOtp(app: Elysia<any>) {
    return app.post(
      "/verify",
      async (ctx) => {
        const { email, otp } = ctx.body
        const sessionCookie = await this.otpService.verifyOtp(email, otp)

        return new Response(null, {
          status: 200,
          headers: {
            "Set-Cookie": sessionCookie,
          },
        })
      },
      {
        type: "json",
        body: t.Object({
          email: t.String({ format: "email" }),
          otp: t.String(),
        }),
      },
    )
  }
}
