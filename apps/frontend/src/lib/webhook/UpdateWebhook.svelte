<script lang="ts">
	import Checkbox from '$lib/cell/CellInput/Checkbox.svelte'
	import { t } from '$lib/i18n'
	import { webhookDrawerMode } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { recordEvents } from '@undb/core'
	import type { IQueryWebhook, createWebhookSchema, updateWebhookSchema } from '@undb/integrations'
	import { Button, Input, Label, Select, Toast } from 'flowbite-svelte'
	import { keys, isEmpty, pick } from 'lodash-es'
	import { slide } from 'svelte/transition'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms/index'
	import WebhookHeaderInput from './WebhookHeaderInput.svelte'

	export let data: Validation<typeof updateWebhookSchema>
	export let webhook: IQueryWebhook

	const table = getTable()

	const updateWebhook = trpc().webhook.update.mutation({
		onSuccess(data, variables, context) {
			$webhookDrawerMode = 'list'
		},
	})

	const { form, enhance, tainted } = superForm(data, {
		id: 'updateWebhook',
		SPA: true,
		dataType: 'json',
		applyAction: true,
		taintedMessage: null,
		async onUpdate(event) {
			const taintedKeys = keys($tainted)
			if (isEmpty(taintedKeys)) return
			const values = pick(event.form.data, taintedKeys)

			$updateWebhook.mutate({
				tableId: $table.id.value,
				webhookId: webhook.id,
				webhook: values,
			})
		},
	})

	$: {
		$form.enabled = webhook.enabled
		$form.event = webhook.target?.event
		$form.method = webhook.method
		$form.name = webhook.name
		$form.url = webhook.url
		$form.headers = webhook.headers
		$tainted = undefined
	}

	const events = recordEvents.map((e) => ({ name: e, value: e }))
	const methods = ['POST', 'PATCH'].map((method) => ({ name: method, value: method }))
</script>

<form id="updateWebhook" method="POST" class="flex-1" use:enhance>
	<div class="h-full flex flex-col justify-between">
		<div class="space-y-2">
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Name', { ns: 'common' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<Input name="name" size="sm" type="text" bind:value={$form.name} />
			</Label>

			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('URL', { ns: 'common' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<Input name="url" size="sm" type="text" bind:value={$form.url} />
			</Label>
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Enabled', { ns: 'common' })}</span>
				</div>

				<Checkbox bind:value={$form.enabled} />
			</Label>
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Method', { ns: 'common' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<Select items={methods} bind:value={$form.method} />
			</Label>
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Event', { ns: 'common' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<Select items={events} bind:value={$form.event} />
			</Label>
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Headers', { ns: 'common' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<WebhookHeaderInput bind:value={$form.headers} />
			</Label>
		</div>
		<div class="w-full flex justify-end gap-4">
			<Button size="xs" color="alternative">{$t('Cancel', { ns: 'common' })}</Button>
			<Button size="xs" form="updateWebhook" type="submit">{$t('Confirm', { ns: 'common' })}</Button>
		</div>
	</div>
</form>

{#if $updateWebhook.error}
	<Toast transition={slide} position="bottom-right" class="z-[99999] !bg-red-500 border-0 text-white font-semibold">
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$updateWebhook.error.message}
		</span>
	</Toast>
{/if}
