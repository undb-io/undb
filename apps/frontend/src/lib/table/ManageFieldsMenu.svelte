<script lang="ts">
	import cx from 'classnames'
	import { invalidate } from '$app/navigation'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { Field } from '@undb/core'
	import { Badge, Button, Checkbox, Hr, Indicator, Modal, Toggle, Tooltip } from 'flowbite-svelte'
	import { filter, isNumber } from 'lodash-es'
	import { createFieldModal } from '$lib/store/modal'
	import Sortable, { type SortableEvent } from 'sortablejs'
	import { hasPermission } from '$lib/store/authz'

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

	let el: HTMLUListElement
	$: if (el) {
		Sortable.create(el, {
			animation: 200,
			direction: 'vertical',
			onEnd,
			disabled: !$hasPermission('table:move_field'),
		})
	}

	function onEnd(e: SortableEvent) {
		const { oldIndex, newIndex } = e
		if (isNumber(oldIndex) && isNumber(newIndex)) {
			const from = fields[oldIndex]?.id.value
			const to = fields[newIndex]?.id.value
			$moveFields.mutate({
				tableId: $table.id.value,
				viewId: $view.id.value,
				from,
				to,
			})
		}
	}
</script>

{#if $hasPermission('table:toggle_field_visibility')}
	<Button
		size="xs"
		color="alternative"
		class={cx(
			'relative h-full !rounded-md gap-2 whitespace-nowrap border-0 hover:!bg-blue-50 dark:hover:!bg-gray-800 text-blue-600 dark:text-gray-100',
			!!hiddenCount && '!bg-blue-50 dark:!bg-primary-600',
		)}
		on:click={() => (open = true)}
	>
		<i class="ti ti-columns-3 text-sm" />
		<span>
			{$t('Manage Fields')}
		</span>
		{#if hiddenCount}
			<Indicator color="blue" border size="xl" placement="top-right">
				<span class="text-white text-xs font-bold">{hiddenCount}</span>
			</Indicator>
			<Tooltip placement="bottom" class="z-50 dark:bg-primary-900 dark:text-gray-100 hidden lg:block">
				{$t('N Fields Hidden', { n: hiddenCount })}
			</Tooltip>
		{/if}
	</Button>
{/if}

<Modal bind:open size="xs" class="w-full" placement="top-center">
	<ul class="space-y-2" bind:this={el}>
		{#each items as item (item.id)}
			{@const checked = visibility[item.id] === undefined || !!visibility[item.id]}
			<li class="flex items-center gap-2 w-full" data-field-id={item.id}>
				<Checkbox
					disabled={(checked && fields.length - hiddenCount === 1) || !$hasPermission('table:toggle_field_visibility')}
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

	{#if $hasPermission('table:toggle_field_visibility')}
		<Hr />

		<Toggle size="small" checked={$view.showSystemFields} on:change={onChangeShowSystemFields}>
			{$t('Show System Fields')}
		</Toggle>
	{/if}

	{#if $hasPermission('table:create_field')}
		<Button size="xs" class="w-full gap-2" color="alternative" on:click={() => createFieldModal.open()}>
			<i class="ti ti-plus" />
			<span>
				{$t('Create New Field')}
			</span>
		</Button>
	{/if}
</Modal>
