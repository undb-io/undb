import type { EntityManager } from '@mikro-orm/better-sqlite'

export type Job = () => Promise<void>

export abstract class BaseEntityManager {
  constructor(protected readonly em: EntityManager) {}

  #jobs: Job[] = []
  public get jobs(): ReadonlyArray<Job> {
    return this.#jobs
  }
  protected addJobs(...jobs: Job[]) {
    this.#jobs.push(...jobs)
  }

  #queries: string[] = []
  public get queries(): ReadonlyArray<string> {
    return this.#queries
  }
  public addQueries(...queries: string[]) {
    this.#queries.push(...queries)
  }
  public unshiftQueries(...queries: string[]) {
    for (const query of queries) {
      this.#queries.unshift(query)
    }
  }

  public async commit() {
    await Promise.all(this.#jobs.map((job) => job()))

    for (const query of this.#queries) {
      await this.em.execute(query)
    }
  }
}
