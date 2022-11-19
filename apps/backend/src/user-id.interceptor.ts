import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { ClsService } from 'nestjs-cls'
import { Observable } from 'rxjs'

@Injectable()
export class UserIdInterceptor implements NestInterceptor {
  constructor(private readonly cls: ClsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    this.cls.set('ip', 'hello ip')
    return next.handle()
  }
}
