import { Module } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { HealthModule } from './health/health.module'
import { modules } from './modules'

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    HealthModule,
    ...modules,
  ],
})
export class AppModule {}
