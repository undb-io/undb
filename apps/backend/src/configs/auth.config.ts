import { Inject } from '@nestjs/common'
import { registerAs } from '@nestjs/config'

export const InjectAuthConfig = () => Inject(authConfig.KEY)

export const authConfig = registerAs('auth', () => ({
  jwt: {
    secret: process.env.UNDB_JWT_SECRET!,
  },
  admin: {
    email: process.env.PUBLIC_UNDB_ADMIN_EMAIL,
    password: process.env.PUBLIC_UNDB_ADMIN_PASSWORD,
    username: process.env.PUBLIC_UNDB_ADMIN_USERNAME,
  },
}))
