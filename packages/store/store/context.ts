import { getContext } from 'redux-saga/effects'
import { api } from '../api'
import { TableApi } from '../services/table'

const client = new TableApi(api)

export type IClient = typeof client

export const context = { client }

export type SagaContext = typeof context

export const getClient = () => getContext('client')
