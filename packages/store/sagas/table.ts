import type { IGetTablesOutput } from '@egodb/core'
import { all, call, fork, put, takeEvery } from 'redux-saga/effects'
import * as actions from '../actions'
import type { IClient } from '../store/context'
import { getClient } from '../store/context'

export function* getTables() {
  const client: IClient = yield getClient()

  const tables: IGetTablesOutput = yield call(client.getTableList, {})

  yield put(actions.receiveTables({ tables }))
}

export function* watchGetProducts() {
  yield takeEvery(actions.getTables.type, getTables)
}

export default function* root() {
  yield all([fork(getTables), fork(watchGetProducts)])
}
