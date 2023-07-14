import { Module } from '@nestjs/common'
import { NestSqliteUnitOfWork, UNIT_OF_WORK } from './uow.service.js'

@Module({
  providers: [
    {
      provide: UNIT_OF_WORK,
      useClass: NestSqliteUnitOfWork,
    },
  ],
  exports: [UNIT_OF_WORK],
})
export class UnitOfWorkModule {}
