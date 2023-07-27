<script lang="ts">
	import CollaboratorComponent from '$lib/cell/CellComponents/CollaboratorComponent.svelte'
	import { t } from '$lib/i18n'
	import { recordTrashModal } from '$lib/store/modal'
	import { getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { RecordFactory } from '@undb/core'
	import { format } from 'date-fns'
	import { Spinner } from 'flowbite-svelte'

	const table = getTable()

	$: schema = $table.schema.toIdMap()

	const getRecords = trpc().record.trash.list.query({
		tableId: $table.id.value,
	})

	$: records = $getRecords.data?.records ?? []

	const restore = trpc().record.restore.mutation({
		async onSuccess(data, variables, context) {
			await $getRecords.refetch()
			if (!$getRecords.data?.total) {
				recordTrashModal.close()
			}
		},
	})
</script>

{#if $getRecords.isLoading}
	<Spinner />
{:else}
	{#each records as record}
		{@const ro = RecordFactory.fromQuery(record, schema).unwrap()}
		{@const deletedProfile = record.deletedByProfile}
		<div class="flex justify-between gap-2 items-center text-xs text-gray-600 dark:text-gray-200">
			<div class="flex items-center gap-2">
				<CollaboratorComponent
					username={deletedProfile.username}
					color={deletedProfile.color}
					avatar={deletedProfile.avatar}
				/>
				<span>
					{$t('deleted', { ns: 'common' })}
				</span>
				<span
					class="bg-gray-200 text-gray-600 border border-gray-300 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-600 dark:text-gray-200"
				>
					{ro.getDisplayFieldsValue($table)}
				</span>
			</div>

			<div class="flex items-center gap-2">
				<span class="text-gray-400 text-xs">
					{format(new Date(record.deletedAt), 'yyyy-MM-dd hh:mm:ss')}
				</span>
				<button
					class="text-blue-400 hover:underline"
					on:click={() =>
						$restore.mutate({
							tableId: $table.id.value,
							id: record.id,
						})}
				>
					{$t('restore', { ns: 'common' })}
				</button>
			</div>
		</div>
	{/each}
{/if}
