<script lang="ts">
	import Checkbox from '$lib/cell/CellInput/Checkbox.svelte'
	import { t } from '$lib/i18n'
	import { webhookDrawerMode } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { recordEvents, type IFilter, isOperatorWithoutValue } from '@undb/core'
	import type { createWebhookSchema } from '@undb/integrations'
	import { Button, Input, Label, Select, Toast } from 'flowbite-svelte'
	import { slide } from 'svelte/transition'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms/index'
	import WebhookHeaderInput from './WebhookHeaderInput.svelte'
	import FilterItem from '$lib/table/FilterItem.svelte'

	export let data: Validation<typeof createWebhookSchema>

	const table = getTable()

	const createWebhook = trpc().webhook.create.mutation({
		onSuccess(data, variables, context) {
			$webhookDrawerMode = 'list'
		},
	})

	const { form, enhance } = superForm(data, {
		id: 'createWebhook',
		SPA: true,
		dataType: 'json',
		applyAction: true,
		taintedMessage: null,
		async onUpdate(event) {
			const validFilters = filters.filter(
				(v) =>
					!!v.path && !!v.operator && !!v.type && (isOperatorWithoutValue(v.operator) ? true : v.value !== undefined),
			) as IFilter[]

			$createWebhook.mutate({
				tableId: $table.id.value,
				webhook: {
					enabled: event.form.data.enabled,
					method: event.form.data.method,
					url: event.form.data.url,
					name: event.form.data.name,
					headers: event.form.data.headers,
					filter: validFilters.length ? validFilters : undefined,
					target: {
						id: $table.id.value,
						type: 'table',
						event: event.form.data.target.event,
					},
				},
			})
		},
	})

	const events = recordEvents.map((e) => ({ name: $t(e, { ns: 'event' }), value: e }))
	const methods = ['POST', 'PATCH'].map((method) => ({ name: method, value: method }))

	const TEMP_ID = '__TEMP_ID'

	let filters = [{ path: TEMP_ID }] as Partial<IFilter>[]
	const addFilter = () => {
		filters = [...filters, { path: TEMP_ID }]
	}
	const removeFilter = (index: number) => {
		filters = filters.filter((f, i) => i !== index)
	}
</script>

<form id="createWebhook" method="POST" class="flex-1" use:enhance>
	<div class="h-full flex flex-col justify-between">
		<div class="space-y-2">
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Name', { ns: 'webhook' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<Input name="name" size="sm" type="text" bind:value={$form.name} />
			</Label>

			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('URL', { ns: 'webhook' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<Input name="url" size="sm" type="text" bind:value={$form.url} />
			</Label>
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Enabled', { ns: 'webhook' })}</span>
				</div>

				<Checkbox bind:value={$form.enabled} />
			</Label>
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Method', { ns: 'webhook' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<Select items={methods} bind:value={$form.method} />
			</Label>
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Event', { ns: 'webhook' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<Select items={events} bind:value={$form.target.event} />
			</Label>
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Filters')}</span>
				</div>

				{#each filters as filter, index (filter.path)}
					<FilterItem {filter} {index} remove={removeFilter} />
				{/each}
			</Label>
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Headers', { ns: 'webhook' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<WebhookHeaderInput bind:value={$form.headers} />
			</Label>
		</div>
		<div class="w-full flex justify-end gap-4">
			<Button size="xs" color="alternative">{$t('Cancel', { ns: 'common' })}</Button>
			<Button size="xs" form="createWebhook" type="submit">{$t('Confirm', { ns: 'common' })}</Button>
		</div>
	</div>
</form>

{#if $createWebhook.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$createWebhook.error.message}
		</span>
	</Toast>
{/if}
