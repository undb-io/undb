export interface IKVCache<V> {
  set(key: string, value: V): Promise<void>
  get(key: string): Promise<V | null>
  remove(key: string): Promise<void>
}
