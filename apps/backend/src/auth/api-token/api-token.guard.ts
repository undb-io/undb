import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { API_TOKEN_AUTH } from './api-token.constants.js'

@Injectable()
export class ApiTokenGuard extends AuthGuard(API_TOKEN_AUTH) {}
