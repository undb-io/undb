import type { Conjunction, Field, MaybeConditionGroup, MaybeFieldCondition } from "@undb/table"
import { uid } from "radash"
import { writable } from "svelte/store"

export const createConditionGroupStore = (defaultConjunction: Conjunction) => {
  const { subscribe, update, set } = writable<MaybeConditionGroup<any> | undefined>()

  function addCondition(field: Field | undefined, fieldValue?: any) {
    if (!field) return

    const conditionOps = field?.conditionOps ?? []
    const condition: MaybeFieldCondition = {
      id: uid(10),
      fieldId: field?.id.value,
      op: conditionOps?.[0] as any,
      value: fieldValue,
    }
    return update((value) => {
      if (!value) {
        value = { children: [condition], conjunction: defaultConjunction, id: uid(10) }
      } else {
        value.children = [...value.children, condition]
      }
      return value
    })
  }

  function addConditionGroup() {
    const conditionGroup: MaybeConditionGroup<any> = {
      id: uid(10),
      conjunction: defaultConjunction,
      children: [],
    }
    return update((value) => {
      if (!value) {
        value = { children: [conditionGroup], conjunction: defaultConjunction, id: uid(10) }
      } else {
        value.children = [...value.children, conditionGroup]
      }
      return value
    })
  }

  function remove(index: number) {
    return update((value) => {
      if (value) {
        value.children.splice(index, 1)
        value.children = [...value.children]
      }
      return value
    })
  }

  function swap(oldIndex: number, newIndex: number) {
    return update((value) => {
      if (value) {
        const conditions = [...value.children]
        const [removed] = conditions.splice(oldIndex, 1)
        conditions.splice(newIndex, 0, removed)
        value.children = [...conditions]
      }
      return value
    })
  }

  return {
    subscribe,
    update,
    set,
    addCondition,
    addConditionGroup,
    remove,
    swap,
  }
}

export type ConditionGroupStore = ReturnType<typeof createConditionGroupStore>
