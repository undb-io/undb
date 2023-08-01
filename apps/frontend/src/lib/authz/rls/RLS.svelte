<script lang="ts">
	import FilterEditor from '$lib/filter/FilterEditor.svelte'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { IFilter } from '@undb/core'
	import { Select, Label, Button } from 'flowbite-svelte'

	const table = getTable()
	const view = getView()

	let selected: string | undefined = 'list'
	let countries = [
		{ value: 'list', name: 'List' },
		{ value: 'view', name: 'View' },
		{ value: 'create', name: 'Create' },
		{ value: 'update', name: 'Update' },
		{ value: 'delete', name: 'Delete' },
	]

	let filter: IFilter[]

	const createRLS = trpc().authz.rls.create.mutation({})
</script>

<div>
	<div class="flex items-center w-full gap-2">
		<Select class="w-30" items={countries} bind:value={selected} size="sm" />

		<div class="flex-1 w-full">
			<FilterEditor bind:value={filter} />
		</div>

		<Button
			class="w-20 whitespace-nowrap"
			color="alternative"
			size="xs"
			on:click={() => {
				$createRLS.mutate({
					tableId: $table.id.value,
					viewId: $view.id.value,
					policy: {
						action: selected,
						filter,
					},
				})
			}}
		>
			{$t('Create RLS')}
		</Button>
	</div>
</div>
