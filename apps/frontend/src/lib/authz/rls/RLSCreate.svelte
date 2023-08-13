<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { getTable, listRecordFn } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { IFilter } from '@undb/core'
	import { Button, Toast } from 'flowbite-svelte'
	import RlsItemEditor from './RLSItemEditor.svelte'
	import type { IRLSAction, RLS } from '@undb/authz'
	import { t } from '$lib/i18n'
	import { slide } from 'svelte/transition'
	import { getValidFilters } from '$lib/filter/filter.util'

	const table = getTable()

	export let action: IRLSAction
	export let rlss: RLS[]

	let filter: Partial<IFilter>[]
	let userIds: string[] = []
	let createMode = false

	const data = $listRecordFn(undefined, { enabled: false })

	const createRLS = trpc().authz.rls.create.mutation({
		async onSettled(variables) {
			await invalidate(`table:${$table.id.value}`)
			filter = []
			userIds = []
			createMode = false
			if ((variables as any)?.policy.action === 'list') {
				await $data.refetch()
			}
		},
	})
</script>

{#if createMode}
	<div class="space-y-2 bg-green-50 border border-green-100 p-2 rounded-md">
		<div class="flex items-start w-full gap-2">
			<div class="flex-1 w-full bg-green-100 border border-green-200 p-1 rounded-md">
				<RlsItemEditor {action} bind:filter bind:userIds />
			</div>
		</div>
		<div class="flex justify-end">
			<Button
				class="whitespace-nowrap"
				size="xs"
				disabled={$createRLS.isLoading}
				on:click={() => {
					const validFilters = getValidFilters(filter)
					if (!validFilters.length) return

					$createRLS.mutate({
						tableId: $table.id.value,
						subjects: userIds.map((userId) => ({ type: 'user', id: userId })),
						policy: {
							action,
							filter: validFilters,
						},
					})
				}}
			>
				{$t('Create New RLS', { ns: 'authz' })}
			</Button>
		</div>
	</div>
{:else}
	<div class="w-full flex items-center justify-center">
		<Button size="sm" on:click={() => (createMode = true)} color={rlss.length ? 'alternative' : 'blue'}>
			{$t('Create New RLS', { ns: 'authz' })}
		</Button>
	</div>
{/if}

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
