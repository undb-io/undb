<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { getTable, listRecordFn } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { IFilter } from '@undb/core'
	import { Button } from '$lib/components/ui/button'
	import RlsItemEditor from './RLSItemEditor.svelte'
	import type { IRLSAction, RLS } from '@undb/authz'
	import { t } from '$lib/i18n'
	import { getValidFilters } from '$lib/filter/filter.util'
	import { toast } from 'svelte-sonner'

	const table = getTable()

	export let action: IRLSAction
	export let rlss: RLS[]

	let filter: Partial<IFilter>[]
	let userIds: string[] = []
	let createMode = false

	const data = $listRecordFn(undefined, { enabled: false })

	const createRLS = trpc().authz.rls.create.mutation({
		async onSettled(variables) {
			toast.success($t('TABLE.RLS_CREATED', { ns: 'success' }))
			await invalidate(`table:${$table.id.value}`)
			filter = []
			userIds = []
			createMode = false
			if ((variables as any)?.policy.action === 'list') {
				await $data.refetch()
			}
		},
		onError(error, variables, context) {
			toast.error(error.message)
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
				size="sm"
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
				<i class="ti ti-plus"></i>
				{$t('Create New RLS', { ns: 'authz' })}
			</Button>
		</div>
	</div>
{:else}
	<div class="w-full flex items-center justify-center">
		<Button size="sm" on:click={() => (createMode = true)} color={rlss.length ? 'alternative' : 'blue'}>
			<i class="ti ti-plus"></i>
			{$t('Create New RLS', { ns: 'authz' })}
		</Button>
	</div>
{/if}
