import { AuthGuard } from '@nestjs/passport'
import { API_TOKEN_AUTH } from './api-token/api-token.constants.js'

export class OpenApiGuard extends AuthGuard([API_TOKEN_AUTH, 'jwt']) {}
