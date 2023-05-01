<script lang="ts">
	import { invalidate } from '$app/navigation'
	import FieldIcon from '$lib/field/FieldIcon.svelte'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { Field } from '@undb/core'
	import { Button, Checkbox, Modal } from 'flowbite-svelte'

	const table = getTable()
	const view = getView()

	let open = false

	$: fields = $table.getOrderedFields($view)
	$: visibility = $view.getVisibility()

	const setVisibility = trpc().table.view.field.setVisibility.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
		},
	})

	const onChange = (e: Event, field: Field) => {
		const ele = e.target as HTMLInputElement

		$setVisibility.mutate({
			tableId: $table.id.value,
			viewId: $view.id.value,
			fieldId: field.id.value,
			hidden: !ele.checked,
		})
	}
</script>

<Button size="xs" color="alternative" class="h-full !rounded-md gap-2 whitespace-nowrap" on:click={() => (open = true)}>
	<i class="ti ti-columns-3 text-sm" />
	{$t('Manage Fields')}</Button
>

<Modal bind:open size="xs" class="w-full">
	<ul class="space-y-2">
		{#each fields as field}
			<Checkbox
				class="flex items-center gap-2"
				checked={visibility[field.id.value] === undefined || !!visibility[field.id.value]}
				on:change={(e) => onChange(e, field)}
			>
				<li class="inline-flex items-center gap-2" data-field-id={field.id.value}>
					<FieldIcon type={field.type} />
					<span>
						{field.name.value}
					</span>
				</li>
			</Checkbox>
		{/each}
	</ul>
</Modal>
