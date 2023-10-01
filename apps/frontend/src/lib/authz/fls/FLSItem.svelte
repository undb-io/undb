<script lang="ts">
	import type { FLS } from '@undb/authz'
	import type { IFilter } from '@undb/core'
	import FlsItemEditor from './FLSItemEditor.svelte'
	import type { ISubjectType } from './fls.type'
	import { Button } from '$lib/components/ui/button'
	import { t } from '$lib/i18n'
	import { hasPermission } from '$lib/store/authz'
	import { invalidate } from '$app/navigation'
	import { trpc } from '$lib/trpc/client'
	import { getTable } from '$lib/store/table'
	import { toast } from 'svelte-sonner'

	const table = getTable()
	export let fls: FLS

	let userIds: string[] = fls.subjects.subjects.map((s) => s.value.id)
	let filter: IFilter[] = fls.policy.filter as IFilter[]
	let subject: ISubjectType

	const updateFLS = trpc().authz.fls.update.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('TABLE.FLS_UPDATED', { ns: 'success' }))
			await invalidate(`table:${$table.id.value}`)
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})

	const deleteFLS = trpc().authz.fls.delete.mutation({
		async onSuccess(data, variables, context) {
			toast.success($t('TABLE.FLS_DELETED', { ns: 'success' }))
			await invalidate(`table:${$table.id.value}`)
		},
		onError(error, variables, context) {
			toast.error(error.message)
		},
	})
</script>

<li class="flex items-start gap-2">
	<div class="flex-1 w-full p-1 rounded-md bg-gray-100 border border-gray-200">
		<FlsItemEditor action={fls.policy.action} bind:filter bind:userIds bind:subject />
	</div>

	{#if $hasPermission('fls:update')}
		<Button
			class="w-20 whitespace-nowrap"
			variant="outline"
			size="sm"
			on:click={() => {
				$updateFLS.mutate({
					id: fls.id.value,
					subjects: subject === 'anyone' ? [] : userIds.map((userId) => ({ type: 'user', id: userId })),
					policy: {
						filter,
					},
				})
			}}
		>
			{$t('Update FLS', { ns: 'authz' })}
		</Button>
	{/if}
	{#if $hasPermission('fls:delete')}
		<Button
			variant="outline"
			size="sm"
			on:click={() =>
				$deleteFLS.mutate({
					id: fls.id.value,
				})}
		>
			<i class="ti ti-trash"></i>
		</Button>
	{/if}
</li>
