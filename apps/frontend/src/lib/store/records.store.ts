import { RecordDO, type Records } from "@undb/table"
import { derived, writable } from "svelte/store"

type RecordStore = {
  lastUpdatedAt: number
  ids: string[]
  records: Map<string, RecordDO>
}

export const createRecordsStore = () => {
  const store = writable<RecordStore>({ lastUpdatedAt: 0, ids: [], records: new Map() })
  const data = writable<any[]>([])

  const { subscribe } = store

  const setRecords = (initial: Records, lastUpdatedAt: number) => {
    return store.update((store) => {
      if (store.lastUpdatedAt >= lastUpdatedAt) {
        return store
      }
      const ids: string[] = []
      const records = new Map<string, RecordDO>()
      for (const record of initial) {
        ids.push(record.id.value)
        records.set(record.id.value, record)
      }

      data.set(initial.records.map((record) => record.flatten()))

      return {
        lastUpdatedAt,
        ids,
        records,
      }
    })
  }

  const setRecord = (record: RecordDO) => {
    return store.update((store) => {
      if (store.records.has(record.id.value)) {
        store.records.set(record.id.value, record)
        data.update((data) => {
          return data.map((d) => (d.id === record.id.value ? record.flatten() : d))
        })
        return store
      } else {
        store.records.set(record.id.value, record)
        store.ids.push(record.id.value)
        data.update((data) => {
          data.push(record.flatten())
          return data
        })
        return store
      }
    })
  }

  const setRecordValue = (id: string, key: string, value: any) => {
    return store.update((store) => {
      if (store.records.has(id)) {
        data.update((data) => {
          return data.map((d) => (d.id === id ? { ...d, [key]: value } : d))
        })
      }
      return store
    })
  }

  const set = (records: Records, lastUpdatedAt: number) => {
    setRecords(records, lastUpdatedAt)
  }

  const records = derived(store, ($store) => $store.ids.map((id) => $store.records.get(id)!))
  const hasRecord = derived(store, ($store) => !!$store.records.size)

  return {
    set,
    setRecord,
    setRecordValue,
    hasRecord,

    subscribe,

    records,
    data,
  }
}

export const recordsStore = createRecordsStore()
