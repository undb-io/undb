import { createTOTPKeyURI, generateTOTP, verifyTOTP } from "@oslojs/otp"
import { singleton } from "@undb/di"
import { type IMailService, injectMailService } from "@undb/mail"
import { injectQueryBuilder, type IQueryBuilder } from "@undb/persistence/server"
import { injectSpaceService, type ISpaceService } from "@undb/space"
import { injectUserService, type IUserService } from "@undb/user"
import { Lucia } from "lucia"
import { decodeHex, encodeHex } from "oslo/encoding"
import { injectLucia } from "./auth.provider"

interface ISendOtpResponse {
  keyURI: string
}

export interface IOtpService {
  sendOtp(email: string): Promise<ISendOtpResponse>
  verifyOtp(email: string, otp: string): Promise<string>
}

const OTP_EXPIRES_IN = 60 * 10
const OTP_DIGITS = 6
const OTP_ISSUER = "undb"

@singleton()
export class OtpService implements IOtpService {
  constructor(
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @injectLucia()
    private readonly lucia: Lucia,
    @injectMailService()
    private readonly mailService: IMailService,
    @injectSpaceService()
    private readonly spaceService: ISpaceService,
    @injectUserService()
    private readonly userService: IUserService,
  ) {}

  public async sendOtp(email: string): Promise<ISendOtpResponse> {
    const user = await this.userService.findOneByEmail(email)
    if (user.isNone()) {
      throw new Error("User not found")
    }

    const secret = new Uint8Array(20)
    const key = crypto.getRandomValues(secret)
    const totp = generateTOTP(key, OTP_EXPIRES_IN, OTP_DIGITS)

    const hex = encodeHex(key)
    await this.qb
      .updateTable("undb_user")
      .set({ otp_secret: hex })
      .where((eb) => eb.eb("undb_user.email", "=", email))
      .execute()

    const issuer = OTP_ISSUER
    const accountName = email
    const intervalInSeconds = OTP_EXPIRES_IN
    const digits = OTP_DIGITS
    const uri = createTOTPKeyURI(issuer, accountName, key, intervalInSeconds, digits)

    await this.mailService.send({
      to: email,
      subject: "One-time password - undb",
      template: "otp",
      data: {
        email,
        action_url: "https://undb.io",
        expires_in: OTP_EXPIRES_IN,
        otp: totp,
      },
    })

    return {
      keyURI: uri,
    }
  }

  /**
   * Verify the OTP, if the OTP is valid, the OTP secret will be cleared.
   *
   * @param email - the email to verify
   * @param otp - the otp to verify
   */
  public async verifyOtp(email: string, otp: string): Promise<string> {
    const { otp_secret, id } = await this.qb
      .selectFrom("undb_user")
      .select(["otp_secret", "id"])
      .where("undb_user.email", "=", email)
      .executeTakeFirstOrThrow()
    let space = await this.spaceService.getSpace({ userId: id })

    if (space.isNone()) {
      throw new Error("No space found")
    }

    if (!otp_secret) {
      throw new Error("No OTP secret found")
    }

    const key = decodeHex(otp_secret)

    const verified = verifyTOTP(key, OTP_EXPIRES_IN, OTP_DIGITS, otp)
    if (!verified) {
      throw new Error("Invalid OTP")
    }

    await this.qb.updateTable("undb_user").set({ otp_secret: null }).where("undb_user.email", "=", email).execute()

    const spaceId = space.unwrap().id.value
    const session = await this.lucia.createSession(id, { spaceId })
    const sessionCookie = this.lucia.createSessionCookie(session.id)

    return sessionCookie.serialize()
  }
}
