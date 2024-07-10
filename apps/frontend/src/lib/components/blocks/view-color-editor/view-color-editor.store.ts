import { writable } from "svelte/store"
import { createConditionGroupStore } from "../filters-editor/filters-editor.store"

export let viewColorEditorOpen = writable(false)

export const viewColorEditorStore = createConditionGroupStore("or")
