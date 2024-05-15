import { container } from "@undb/di"
import type { IUnitOfWork } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { DB_UNIT_OF_WORK_PROVIDER } from "./db.unit-of-work.provider"

export function transactional() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const logger = createLogger(target.name + "." + originalMethod.name)

    descriptor.value = async function (...args: any[]) {
      let uow = target.uow as IUnitOfWork | undefined
      if (!uow) {
        logger.warn('No unit of work found, you should inject a unit of work in the repository constructor named "uow"')
        uow = container.resolve<IUnitOfWork>(DB_UNIT_OF_WORK_PROVIDER)
      }
      await uow.begin()
      try {
        const result = await originalMethod.apply(this, args)
        await uow.commit()
        return result
      } catch (error) {
        await uow.rollback()
        throw error
      }
    }

    return descriptor
  }
}
