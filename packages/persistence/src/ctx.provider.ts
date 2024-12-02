import { inject } from "@undb/di"

export const TX_CTX = Symbol("tx_ctx")
export const injectTxCTX = () => inject(TX_CTX)
