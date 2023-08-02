<script lang="ts">
	import FilterEditor from '$lib/filter/FilterEditor.svelte'
	import { t } from '$lib/i18n'
	import { getTable, getView } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { IFilter } from '@undb/core'
	import { Select, Label, Button, Toast } from 'flowbite-svelte'
	import { slide } from 'svelte/transition'
	import RlsList from './RlsList.svelte'
	import { actions } from './actions'

	const table = getTable()
	const view = getView()

	let selected: string | undefined = 'list'

	let filter: IFilter[]

	const createRLS = trpc().authz.rls.create.mutation({})
</script>

<div class="space-y-2">
	<RlsList />
	<div class="flex items-center w-full gap-2">
		<Select class="w-30" items={actions} bind:value={selected} size="sm" />

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

{#if $createRLS.error}
	<Toast
		transition={slide}
		position="bottom-right"
		class="z-[99999] !bg-red-500 border-0 text-white font-semibold fixed"
	>
		<span class="inline-flex items-center gap-3">
			<i class="ti ti-exclamation-circle text-lg" />
			{$createRLS.error.message}
		</span>
	</Toast>
{/if}
