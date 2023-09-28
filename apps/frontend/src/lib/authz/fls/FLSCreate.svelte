<script lang="ts">
	import { invalidate } from '$app/navigation'
	import { currentFieldId, getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import type { IFilter } from '@undb/core'
	import { Button } from '$lib/components/ui/button'
	import FlsItemEditor from './FLSItemEditor.svelte'
	import { t } from '$lib/i18n'
	import { getValidFilters } from '$lib/filter/filter.util'
	import type { FLS, IFLSAction } from '@undb/authz'
	import { toast } from 'svelte-sonner'

	const table = getTable()

	export let action: IFLSAction
	export let flss: FLS[]

	let filter: Partial<IFilter>[]
	let userIds: string[] = []
	let createMode = false

	const createFLS = trpc().authz.fls.create.mutation({
		async onSettled(variables) {
			toast.success($t('TABLE.FLS_CREATED', { ns: 'success' }))
			await invalidate(`table:${$table.id.value}`)
			filter = []
			userIds = []
			createMode = false
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
				<FlsItemEditor {action} bind:filter bind:userIds />
			</div>
		</div>
		<div class="flex justify-end">
			<Button
				class="whitespace-nowrap"
				size="sm"
				disabled={$createFLS.isLoading}
				on:click={() => {
					const validFilters = getValidFilters(filter)
					if (!validFilters.length) return

					$createFLS.mutate({
						tableId: $table.id.value,
						fieldId: $currentFieldId,
						subjects: userIds.map((userId) => ({ type: 'user', id: userId })),
						policy: {
							action,
							filter: validFilters,
						},
					})
				}}
			>
				{$t('Create New FLS', { ns: 'authz' })}
			</Button>
		</div>
	</div>
{:else}
	<div class="w-full flex items-center justify-center">
		<Button size="sm" on:click={() => (createMode = true)} color={flss.length ? 'alternative' : 'blue'}>
			{$t('Create New FLS', { ns: 'authz' })}
		</Button>
	</div>
{/if}
