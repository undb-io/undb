<script lang="ts">
	import { invalidate } from '$app/navigation'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { Field } from '@undb/core'
	import { Checkbox } from '$lib/components/ui/checkbox'
	import { filter, isNumber } from 'lodash-es'
	import { createFieldModal } from '$lib/store/modal'
	import Sortable, { type SortableEvent } from 'sortablejs'
	import { hasPermission } from '$lib/store/authz'
	import { Button } from '$components/ui/button'
	import * as Popover from '$lib/components/ui/popover'
	import { Separator } from '$lib/components/ui/separator'
	import { Label } from '$lib/components/ui/label'
	import { Switch } from '$lib/components/ui/switch'
	import { Badge } from '$components/ui/badge'
	import { cn } from '$lib/utils'

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
		const target = e.target as HTMLInputElement
		const checked = target.checked
		$setVisibility.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			fieldId: field.id.value,
			hidden: !checked,
		})
	}

	const setShowSystemFields = trpc().table.view.setShowSystemFields.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const onChangeShowSystemFields = (value: boolean | undefined) => {
		$setShowSystemFields.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			showSystemFields: !!value,
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
			handle: '.handle',
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
	<Popover.Root positioning={{ placement: 'bottom-start' }} closeOnEscape bind:open>
		<Popover.Trigger asChild let:builder>
			<Button
				builders={[builder]}
				variant="ghost"
				class={cn(
					'gap-2 whitespace-nowrap border-2 border-transparent',
					hiddenCount &&
						'bg-sky-100 hover:bg-sky-100 hover:border-sky-200 text-sky-800 hover:text-sky-950 dark:bg-sky-600 dark:text-sky-100',
					open && hiddenCount && 'border-sky-200 text-sky-950',
					open && !hiddenCount && 'bg-gray-100',
				)}
				size="sm"
			>
				<i class="ti ti-columns-3 text-sm" />
				{#if hiddenCount}
					<span>{hiddenCount}</span>
				{/if}
				<span>
					{$t('Manage Fields')}
				</span>
			</Button>
		</Popover.Trigger>
		<Popover.Content class="w-[400px]">
			<ul class="space-y-1 max-h-64 overflow-auto" bind:this={el}>
				{#each items as item (item.id)}
					{@const checked = visibility[item.id] === undefined || !!visibility[item.id]}
					<li class="flex items-center gap-2 w-full justify-between group" data-field-id={item.id}>
						<Label class="flex items-center justify-center gap-2 text-sm font-normal">
							<input
								type="checkbox"
								disabled={(checked && fields.length - hiddenCount === 1) ||
									!$hasPermission('table:toggle_field_visibility')}
								class="flex items-center gap-2"
								{checked}
								on:change={(e) => onChangeVisibility(e, item.field)}
							/>

							<div>
								<FieldIcon type={item.field.type} />
								<span>
									{item.field.name.value}
								</span>
							</div>
						</Label>

						<i class="ti ti-grip-vertical text-gray-500 cursor-grab handle"></i>
					</li>
				{/each}
			</ul>

			{#if $hasPermission('table:toggle_field_visibility')}
				<Separator class="my-4" />

				<div class="flex items-center space-x-2">
					<Label for="show-system-fields" class="flex items-center gap-2">
						<Switch
							id="show-system-fields"
							bind:checked={$view.showSystemFields}
							onCheckedChange={onChangeShowSystemFields}
						/>
						{$t('Show System Fields')}
					</Label>
				</div>
			{/if}

			{#if $hasPermission('table:create_field')}
				<Button
					size="sm"
					variant="outline"
					class="mt-4 w-full gap-2 border-gray-200 text-gray-900 dark:text-gray-300  dark:hover:text-gray-50 dark:hover:border-gray-300 !bg-[unset] border hover:!bg-gray-100 dark:hover:!bg-[unset]"
					on:click={() => {
						open = false
						createFieldModal.open()
					}}
				>
					<i class="ti ti-plus" />
					<span>
						{$t('Create New Field')}
					</span>
				</Button>
			{/if}
		</Popover.Content>
	</Popover.Root>
{/if}
