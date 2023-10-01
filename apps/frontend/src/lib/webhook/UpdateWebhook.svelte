<script lang="ts">
	import { t } from '$lib/i18n'
	import { webhookDrawerMode } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { recordEvents, type IFilter } from '@undb/core'
	import type { IQueryWebhook, updateWebhookSchema } from '@undb/integrations'
	import { Label } from '$lib/components/ui/label'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$components/ui/button'
	import { Checkbox } from '$lib/components/ui/checkbox'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { keys, pick } from 'lodash-es'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms/index'
	import WebhookHeaderInput from './WebhookHeaderInput.svelte'
	import FilterEditor from '$lib/filter/FilterEditor.svelte'
	import { getValidFilters } from '$lib/filter/filter.util'
	import { toast } from 'svelte-sonner'

	export let data: Validation<typeof updateWebhookSchema>
	export let webhook: IQueryWebhook

	const table = getTable()

	const updateWebhook = trpc().webhook.update.mutation({
		onSuccess() {
			toast.success($t('WEBHOOK.UPDATED', { ns: 'success', name: webhook.name }))
			$webhookDrawerMode = 'list'
		},
		onError(error) {
			toast.error(error.message)
		},
	})

	const { form, enhance, tainted } = superForm(data, {
		id: 'updateWebhook',
		SPA: true,
		dataType: 'json',
		applyAction: true,
		taintedMessage: null,
		resetForm: false,
		async onUpdate(event) {
			const validFilters = getValidFilters(event.form.data.filter as IFilter[])

			const taintedKeys = keys($tainted)
			const values = pick(event.form.data, taintedKeys)
			values.filter = validFilters

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
		$form.filter = webhook.filter
		$tainted = undefined
	}

	let filters = webhook.filter as IFilter[]
	const events = recordEvents.map((e) => ({ name: $t(e, { ns: 'event' }), value: e }))
	const methods = ['POST', 'PATCH'].map((method) => ({ name: method, value: method }))
</script>

<form id="updateWebhook" method="POST" class="flex-1" use:enhance>
	<div class="h-full flex flex-col justify-between">
		<div class="space-y-2">
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Name', { ns: 'webhook' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<Input name="name" type="text" bind:value={$form.name} />
			</Label>

			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('URL', { ns: 'webhook' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<Input name="url" type="text" bind:value={$form.url} />
			</Label>
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Enabled', { ns: 'webhook' })}</span>
				</div>

				<Checkbox bind:checked={$form.enabled} />
			</Label>
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Method', { ns: 'webhook' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="outline" builders={[builder]} class="gap-2" type="button">
							{#if $form.method}
								<span>
									{$t($form.method, { ns: 'webhook' })}
								</span>
							{/if}
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56">
						<DropdownMenu.RadioGroup bind:value={$form.method}>
							{#each methods as method}
								<DropdownMenu.RadioItem value={method.value}>
									{method.name}
								</DropdownMenu.RadioItem>
							{/each}
						</DropdownMenu.RadioGroup>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Label>
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Event', { ns: 'webhook' })}</span>
					<span class="text-red-500">*</span>
				</div>

				<DropdownMenu.Root>
					<DropdownMenu.Trigger asChild let:builder>
						<Button variant="outline" builders={[builder]} class="gap-2" type="button">
							{#if $form.event}
								<span>
									{$t($form.event, { ns: 'event' })}
								</span>
							{/if}
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56">
						<DropdownMenu.RadioGroup bind:value={$form.event}>
							{#each events as event}
								<DropdownMenu.RadioItem value={event.value}>
									{event.name}
								</DropdownMenu.RadioItem>
							{/each}
						</DropdownMenu.RadioGroup>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Label>
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Filter')}</span>
				</div>
			</Label>
			<FilterEditor bind:value={filters} let:add createInitial={false}>
				<Button variant="outline" type="button" on:click={add} class="w-full">
					{$t('Create New Filter')}
				</Button>
			</FilterEditor>
			<Label class="flex flex-col gap-2 w-full">
				<div class="flex gap-2 items-center">
					<span>{$t('Headers', { ns: 'webhook' })}</span>
				</div>

				<WebhookHeaderInput bind:value={$form.headers} />
			</Label>
		</div>
		<div class="w-full flex justify-end gap-4 mt-4">
			<Button size="sm" type="button" variant="secondary">{$t('Cancel', { ns: 'common' })}</Button>
			<Button size="sm" form="updateWebhook" type="submit">{$t('Confirm', { ns: 'common' })}</Button>
		</div>
	</div>
</form>
