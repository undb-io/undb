<script lang="ts">
	import { invalidate } from '$app/navigation'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { createFieldOpen } from '$lib/store/modal'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { Field } from '@undb/core'
	import { Button, Checkbox, Hr, Modal, Toggle } from 'flowbite-svelte'
	import { dndzone } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'

	const table = getTable()
	const view = getView()

	let open = true

	$: fields = $table.getOrderedFields($view)
	$: items = fields.map((field) => ({ field, id: field.id.value }))
	$: visibility = $view.getVisibility()

	const setVisibility = trpc().table.view.field.setVisibility.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const onChangeVisibility = (e: Event, field: Field) => {
		const ele = e.target as HTMLInputElement

		$setVisibility.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			fieldId: field.id.value,
			hidden: !ele.checked,
		})
	}

	const setShowSystemFields = trpc().table.view.setShowSystemFields.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const onChangeShowSystemFields = (e: Event) => {
		const ele = e.target as HTMLInputElement

		$setShowSystemFields.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			showSystemFields: ele.checked,
		})
	}

	const flipDurationMs = 200
	function handleDndConsider(e: CustomEvent) {
		items = e.detail.items
	}
	function handleDndFinalize(e: CustomEvent) {
		items = e.detail.items
	}
</script>

<Button
	size="xs"
	color="alternative"
	class="h-full !rounded-md gap-2 whitespace-nowrap border-0 hover:!bg-blue-50 !text-blue-600"
	on:click={() => (open = true)}
>
	<i class="ti ti-columns-3 text-sm" />
	{$t('Manage Fields')}</Button
>

<Modal bind:open size="xs" class="w-full" placement="top-center">
	<ul
		class="space-y-2"
		use:dndzone={{ items, flipDurationMs, dropTargetStyle: {} }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each items as item (item.id)}
			<li animate:flip={{ duration: flipDurationMs }} class="flex items-center gap-2" data-field-id={item.id}>
				<Checkbox
					class="flex items-center gap-2"
					checked={visibility[item.id] === undefined || !!visibility[item.id]}
					on:change={(e) => onChangeVisibility(e, item.field)}
				>
					<FieldIcon type={item.field.type} />
					<span>
						{item.field.name.value}
					</span>
				</Checkbox>
			</li>
		{/each}
	</ul>

	<Hr />

	<Toggle size="small" checked={$view.showSystemFields} on:change={onChangeShowSystemFields}
		>{$t('Show System Fields')}</Toggle
	>

	<Button size="xs" class="w-full gap-2" color="alternative" on:click={() => ($createFieldOpen = true)}>
		<i class="ti ti-plus" />
		<span>
			{$t('Create New Field')}
		</span>
	</Button>
</Modal>
