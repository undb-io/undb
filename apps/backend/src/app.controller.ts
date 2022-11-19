import { Controller, Get, UseInterceptors } from '@nestjs/common'
import { AppService } from './app.service'
import { UserIdInterceptor } from './user-id.interceptor'

@UseInterceptors(UserIdInterceptor)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello()
  }
}
