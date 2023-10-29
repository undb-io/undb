<script lang="ts">
	import { t } from '$lib/i18n'
	import { webhookDrawerMode } from '$lib/store/drawer'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { recordEvents, type IFilter } from '@undb/core'
	import type { createWebhookSchema } from '@undb/integrations'
	import { Label } from '$lib/components/ui/label'
	import { Input } from '$lib/components/ui/input'
	import { Button } from '$components/ui/button'
	import { Checkbox } from '$lib/components/ui/checkbox'
	import { superForm } from 'sveltekit-superforms/client'
	import type { Validation } from 'sveltekit-superforms/index'
	import WebhookHeaderInput from './WebhookHeaderInput.svelte'
	import FilterEditor from '$lib/filter/FilterEditor.svelte'
	import { getValidFilters } from '$lib/filter/filter.util'
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu'
	import { toast } from 'svelte-sonner'

	export let data: Validation<typeof createWebhookSchema>

	const table = getTable()

	const createWebhook = trpc().webhook.create.mutation({
		onSuccess() {
			$webhookDrawerMode = 'list'
			toast.success($t('WEBHOOK.CREATED', { ns: 'success', name: $form.name }))
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	const { form, enhance } = superForm(data, {
		id: 'createWebhook',
		SPA: true,
		dataType: 'json',
		applyAction: true,
		taintedMessage: null,
		async onUpdate(event) {
			const validFilters = getValidFilters(filters)

			$createWebhook.mutate({
				tableId: $table.id.value,
				webhook: {
					enabled: event.form.data.enabled,
					method: event.form.data.method,
					url: event.form.data.url,
					name: event.form.data.name,
					headers: event.form.data.headers,
					filter: validFilters.length ? validFilters : undefined,
					event: event.form.data.target.event,
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

	let filters: Partial<IFilter>[] = []
</script>

<form id="createWebhook" method="POST" class="flex-1" use:enhance>
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
							{#if $form.target.event}
								<span>
									{$t($form.target.event, { ns: 'event' })}
								</span>
							{/if}
						</Button>
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-56">
						<DropdownMenu.RadioGroup bind:value={$form.target.event}>
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
			<Button size="sm" form="createWebhook" type="submit">{$t('Confirm', { ns: 'common' })}</Button>
		</div>
	</div>
</form>
