import { IQueryBuilder, startTransaction } from "@undb/persistence"

export const withTransaction = (qb: IQueryBuilder) => (callback: () => Promise<any>) => {
  return new Promise((resolve) => {
    return qb
      .transaction()
      .setIsolationLevel("read committed")
      .execute(async (trx) => {
        startTransaction(trx)
        const result = await callback()
        resolve(result)
      })
  })
}
