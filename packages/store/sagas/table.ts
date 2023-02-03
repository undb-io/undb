/* eslint-disable no-constant-condition */

import { all, fork, put, takeEvery } from 'redux-saga/effects'
import * as actions from '../actions'

export function* getTables() {
  yield put(actions.receiveTables({ tables: [] }))
}

export function* watchGetProducts() {
  yield takeEvery(actions.getTables.type, getTables)
}

export default function* root() {
  yield all([fork(getTables), fork(watchGetProducts)])
}
