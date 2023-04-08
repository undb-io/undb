import { Inject } from '@nestjs/common'
import { registerAs } from '@nestjs/config'

export const InjectAuthConfig = () => Inject(authConfig.KEY)

export const authConfig = registerAs('auth', () => ({
  jwt: {
    secret: process.env.EGODB_JWT_SECRET!,
  },
}))
