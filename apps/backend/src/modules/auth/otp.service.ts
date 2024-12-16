import { generateTOTP, verifyTOTP } from "@oslojs/otp"
import { singleton } from "@undb/di"
import { type IMailService, injectMailService } from "@undb/mail"
import { injectQueryBuilder, type IQueryBuilder } from "@undb/persistence/server"
import { injectSpaceService, type ISpaceService } from "@undb/space"
import { Lucia } from "lucia"
import { decodeHex, encodeHex } from "oslo/encoding"
import { injectLucia } from "./auth.provider"

export interface IOtpService {
  sendOtp(email: string): Promise<void>
  verifyOtp(email: string, otp: string): Promise<string>
}

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
  ) {}

  public async sendOtp(email: string): Promise<void> {
    await this.qb.selectFrom("undb_user").selectAll().where("undb_user.email", "=", email).executeTakeFirstOrThrow()

    const secret = new Uint8Array(20)
    const key = crypto.getRandomValues(secret)
    const totp = generateTOTP(key, 60 * 10, 6)

    const hex = encodeHex(key)
    await this.qb
      .updateTable("undb_user")
      .set({ otp_secret: hex })
      .where((eb) => eb.eb("undb_user.email", "=", email))
      .execute()

    console.log(totp)
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

    const verified = verifyTOTP(key, 60 * 10, 6, otp)
    if (!verified) {
      throw new Error("Invalid OTP")
    }

    await this.qb.updateTable("undb_user").set({ otp_secret: null }).where("undb_user.email", "=", email).execute()

    const session = await this.lucia.createSession(id, { space_id: space.unwrap().id.value })
    const sessionCookie = this.lucia.createSessionCookie(session.id)

    return sessionCookie.serialize()
  }
}
