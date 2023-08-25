import type { IQueryWebhook } from '@undb/integrations'
import { derived, writable } from 'svelte/store'
import { currentTable } from './table'

export const webhookDrawerMode = writable<'list' | 'create' | 'update'>('list')

export const selectedWebhook = writable<IQueryWebhook | undefined>(undefined)

export const formDrawerMode = writable<'list' | 'create'>('list')

export const selectedFormId = writable<string | undefined>(undefined)

export const selectedForm = derived([currentTable, selectedFormId], ([$table, $formId]) =>
	$formId ? $table.forms.getById($formId).into() : undefined,
)
