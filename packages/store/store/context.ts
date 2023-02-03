import type { IGetTablesQuery } from '@egodb/core'
import { getContext } from 'redux-saga/effects'
import { api } from '../api'

const client = {
  async getTableList(params: IGetTablesQuery) {
    return api.table.list.query(params)
  },
}

export type IClient = typeof client

export const context = { client }

export type SagaContext = typeof context

export const getClient = () => getContext('client')
