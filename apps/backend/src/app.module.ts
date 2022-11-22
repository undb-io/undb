import { Module } from '@nestjs/common'
import { ClsModule } from 'nestjs-cls'
import { HealthModule } from './health/health.module'
import { modules } from './modules'
import { TrpcModule } from './trpc/trpc.module'

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    HealthModule,
    TrpcModule,
    ...modules,
  ],
})
export class AppModule {}
