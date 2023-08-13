<script lang="ts">
	import type { RLS } from '@undb/authz'
	import { Button } from 'flowbite-svelte'
	import { t } from '$lib/i18n'
	import { trpc } from '$lib/trpc/client'
	import { invalidate } from '$app/navigation'
	import { getTable, listRecordFn } from '$lib/store/table'
	import type { IFilter } from '@undb/core'
	import RlsItemEditor from './RLSItemEditor.svelte'
	import type { ISubjectType } from './rls.type'
	import { hasPermission } from '$lib/store/authz'

	export let rls: RLS

	const table = getTable()

	let userIds: string[] = rls.subjects.subjects.map((s) => s.value.id)
	let filter: IFilter[] = rls.policy.filter as IFilter[]
	let subject: ISubjectType

	$: data = $listRecordFn(undefined, { enabled: false })

	const deleteRLS = trpc().authz.rls.delete.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			if (rls.policy.action === 'list') {
				await $data.refetch()
			}
		},
	})

	const updateRLS = trpc().authz.rls.update.mutation({
		async onSuccess(data, variables, context) {
			await invalidate(`table:${$table.id.value}`)
			if (rls.policy.action === 'list') {
				await $data.refetch()
			}
		},
	})
</script>

<li class="flex items-start gap-2">
	<div class="flex-1 w-full p-1 rounded-md bg-gray-100 border border-gray-200">
		<RlsItemEditor action={rls.policy.action} bind:filter bind:userIds bind:subject />
	</div>

	{#if $hasPermission('rls:update')}
		<Button
			class="w-20 whitespace-nowrap"
			color="alternative"
			size="xs"
			on:click={() => {
				$updateRLS.mutate({
					id: rls.id.value,
					subjects: subject === 'anyone' ? [] : userIds.map((userId) => ({ type: 'user', id: userId })),
					policy: {
						filter,
					},
				})
			}}
		>
			{$t('Update RLS', { ns: 'authz' })}
		</Button>
	{/if}
	{#if $hasPermission('rls:delete')}
		<Button
			color="alternative"
			size="xs"
			on:click={() =>
				$deleteRLS.mutate({
					id: rls.id.value,
				})}
		>
			<i class="ti ti-trash"></i>
		</Button>
	{/if}
</li>
