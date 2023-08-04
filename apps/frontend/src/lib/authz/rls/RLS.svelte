<script lang="ts">
	import FilterEditor from '$lib/filter/FilterEditor.svelte'
	import { t } from '$lib/i18n'
	import { currentRLSS, getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { IFilter } from '@undb/core'
	import { Select, Button, Toast } from 'flowbite-svelte'
	import { slide } from 'svelte/transition'
	import RlsList from './RlsList.svelte'
	import { actions } from './actions'
	import { invalidate } from '$app/navigation'
	import EmptyRls from './EmptyRLS.svelte'

	const table = getTable()

	let createMode = false
	let selected: string | undefined = 'list'

	let filter: IFilter[]

	const createRLS = trpc().authz.rls.create.mutation({
		async onSettled(data, error, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			filter = []
			createMode = false
		},
	})
</script>

<div class="space-y-2">
	<div class="p-2 bg-gray-50 border border-gray-100 rounded-md">
		{#if !$currentRLSS.length}
			<EmptyRls />
		{:else}
			<RlsList />
		{/if}
	</div>
	{#if createMode}
		<div class="flex items-start w-full gap-2 bg-green-50 border border-green-100 p-2 rounded-md">
			<Select class="w-30" items={actions} bind:value={selected} size="sm" />

			<div class="flex-1 w-full bg-green-100 border border-green-200 p-1 rounded-md">
				<FilterEditor bind:value={filter}></FilterEditor>
			</div>

			<Button
				class="w-20 whitespace-nowrap"
				color="alternative"
				size="xs"
				disabled={$createRLS.isLoading}
				on:click={() => {
					$createRLS.mutate({
						tableId: $table.id.value,
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
	{:else}
		<div class="w-full">
			<Button
				size="sm"
				on:click={() => (createMode = true)}
				color={$currentRLSS.length ? 'alternative' : 'blue'}
				class="w-full">{$t('Create New RLS', { ns: 'authz' })}</Button
			>
		</div>
	{/if}
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
