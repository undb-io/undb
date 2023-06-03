import type { EntityManager } from '@mikro-orm/better-sqlite'

export type Job = () => Promise<void>

export abstract class BaseEntityManager {
  constructor(protected readonly em: EntityManager) {}

  protected _jobs: Job[] = []
  public get jobs(): ReadonlyArray<Job> {
    return this._jobs
  }
  protected addJobs(...jobs: Job[]) {
    this._jobs.push(...jobs)
  }
  protected unshiftJobs(...jobs: Job[]) {
    this._jobs.unshift(...jobs.reverse())
  }

  protected _queries: string[] = []
  public get queries(): ReadonlyArray<string> {
    return this._queries
  }
  public addQueries(...queries: string[]) {
    this._queries.push(...queries)
  }
  public unshiftQueries(...queries: string[]) {
    for (const query of queries.reverse()) {
      this._queries.unshift(query)
    }
  }

  public async commit() {
    for (const query of this._queries) {
      await this.em.execute(query)
    }
    await Promise.all(this._jobs.map((job) => job()))

    await this.em.flush()
  }
}
