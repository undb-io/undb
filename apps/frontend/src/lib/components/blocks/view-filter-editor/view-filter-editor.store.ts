import { writable } from "svelte/store"
import { createConditionGroupStore } from "../filters-editor/filters-editor.store"

export let viewConditionEditorOpen = writable(false)

export const viewConditionEditorStore = createConditionGroupStore("and")
