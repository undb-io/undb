import type { Base, IBaseRepository, IBaseSpecification } from "@undb/base"
import { inject, singleton } from "@undb/di"
import type { IUnitOfWork, Option } from "@undb/domain"
import type { Database } from "../db"
import { injectDb } from "../db.provider"
import { baseTable } from "../tables"
import { injectDbUnitOfWork } from "../uow"
import { BaseMapper } from "./base.mapper"

@singleton()
export class BaseRepository implements IBaseRepository {
  constructor(
    @injectDb()
    private readonly db: Database,
    @inject(BaseMapper)
    private readonly mapper: BaseMapper,
    @injectDbUnitOfWork()
    public readonly uow: IUnitOfWork,
  ) {}

  find(spec: IBaseSpecification): Promise<Base[]> {
    throw new Error("Method not implemented.")
  }
  findOneById(id: string): Promise<Option<Base>> {
    throw new Error("Method not implemented.")
  }
  async insert(base: Base): Promise<void> {
    const values = this.mapper.toEntity(base)

    await this.db.insert(baseTable).values(values)
  }
  updateOneById(id: string, spec: IBaseSpecification): Promise<void> {
    throw new Error("Method not implemented.")
  }
  deleteOneById(id: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
