<script lang="ts">
	import cx from 'classnames'
	import { invalidate } from '$app/navigation'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { Field } from '@undb/core'
	import { Badge, Button, Checkbox, Hr, Modal, Toggle } from 'flowbite-svelte'
	import { filter } from 'lodash-es'
	import { dndzone } from 'svelte-dnd-action'
	import { flip } from 'svelte/animate'
	import { createFieldModal } from '$lib/store/modal'

	const table = getTable()
	const view = getView()

	let open = false

	$: fields = $table.getOrderedFields($view)
	$: items = fields.map((field) => ({ field, id: field.id.value }))
	$: visibility = $view.getVisibility()
	$: hiddenCount = filter(visibility, (f: boolean | undefined) => f === false).length

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

	const moveFields = trpc().table.view.field.move.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const flipDurationMs = 200
	function handleDndConsider(e: CustomEvent) {
		items = e.detail.items
	}
	function handleDndFinalize(e: CustomEvent) {
		items = e.detail.items
		const from = e.detail.info.id
		const toIndex = items.findIndex((i) => i.id === from)
		const to = fields[toIndex]?.id.value
		$moveFields.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			from,
			to,
		})
	}
</script>

<Button
	size="xs"
	color="alternative"
	class={cx(
		'h-full !rounded-md gap-2 whitespace-nowrap border-0 hover:!bg-blue-50 !text-blue-600',
		!!hiddenCount && '!bg-blue-50',
	)}
	on:click={() => (open = true)}
>
	<i class="ti ti-columns-3 text-sm" />
	<span>
		{$t('Manage Fields')}
	</span>
	{#if hiddenCount}
		<Badge color="dark">{$t('N Fields Hidden', { n: hiddenCount })}</Badge>
	{/if}
</Button>

<Modal bind:open size="xs" class="w-full" placement="top-center">
	<ul
		class="space-y-2"
		use:dndzone={{ items, flipDurationMs, dropTargetStyle: {} }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each items as item (item.id)}
			{@const checked = visibility[item.id] === undefined || !!visibility[item.id]}
			<li animate:flip={{ duration: flipDurationMs }} class="flex items-center gap-2" data-field-id={item.id}>
				<Checkbox
					disabled={checked && fields.length - hiddenCount === 1}
					class="flex items-center gap-2"
					{checked}
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

	<Button size="xs" class="w-full gap-2" color="alternative" on:click={() => createFieldModal.open()}>
		<i class="ti ti-plus" />
		<span>
			{$t('Create New Field')}
		</span>
	</Button>
</Modal>
