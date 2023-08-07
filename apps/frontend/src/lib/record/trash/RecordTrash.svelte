<script lang="ts">
	import CollaboratorComponent from '$lib/cell/CellComponents/CollaboratorComponent.svelte'
	import { isString } from 'lodash-es'
	import { formatDistance } from '$lib/date'
	import { t } from '$lib/i18n'
	import { recordTrashModal } from '$lib/store/modal'
	import { createPagination } from '$lib/store/pagination'
	import { createSpec, getTable } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { RecordFactory } from '@undb/core'
	import { format } from 'date-fns'
	import { Spinner, PaginationItem, Search, Button } from 'flowbite-svelte'

	const table = getTable()

	$: schema = $table.schema.toIdMap()

	const itemPerPage = 20

	$: getRecords = trpc().record.trash.list.query({
		tableId: $table.id.value,
		pagination: $pagination,
		q: q || undefined,
	})

	$: records = $getRecords.data?.records ?? []
	$: total = $getRecords.data?.total ?? 0
	$: totalPage = Math.ceil(total / itemPerPage)
	$: currentPage = $pagination.page
	const pagination = createPagination(itemPerPage)

	const restore = trpc().record.restore.mutation({
		async onSuccess() {
			await $getRecords.refetch()
			if (!$getRecords.data?.total) {
				recordTrashModal.close()
			}
		},
	})

	let form: HTMLFormElement
	let q = ''

	const onSubmit = (e: Event) => {
		e.preventDefault()
		pagination.reset()
		const formData = new FormData(form)
		const query = formData.get('search')
		if (isString(query) && !!query) {
			q = query
		}
	}
</script>

{#if $getRecords.isLoading}
	<Spinner />
{:else}
	<div>
		<form bind:this={form} on:submit={onSubmit}>
			<div class="flex items-center gap-2">
				<Search name="search" placeholder={$t('search trash')} size="sm"></Search>
				<Button type="submit" size="xs" class="!p-2.5 hidden lg:block">
					<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</Button>
			</div>
		</form>
	</div>
	<div class="space-y-4">
		{#each records as record}
			{@const ro = RecordFactory.fromQuery(record, schema).unwrap()}
			{@const deletedProfile = record.deletedByProfile}
			{@const canCreate = $createSpec.isNone() ? true : $createSpec.unwrap().isSatisfiedBy(ro)}
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
						class="bg-gray-200 text-gray-600 border border-gray-300 dark:border-gray-950 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-600 dark:text-gray-200"
					>
						{ro.getDisplayFieldsValue($table)}
					</span>
				</div>

				<div class="flex items-center gap-2">
					<span class="text-gray-400 text-xs" title={format(new Date(record.deletedAt), 'yyyy-MM-dd HH:mm:ss')}>
						{$formatDistance(new Date(record.deletedAt))}
					</span>
					{#if canCreate}
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
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<div class="flex justify-center w-full space-x-3">
		<PaginationItem
			class="flex items-center gap-2"
			on:click={() => {
				if (currentPage <= 1) return
				pagination.prev()
			}}
		>
			<i class="ti ti-chevron-left text-lg font-bold"></i>
			<span>
				{$t('previous', { ns: 'common' })}
			</span>
		</PaginationItem>
		<PaginationItem
			class="flex items-center gap-2"
			on:click={() => {
				if (currentPage >= totalPage) return
				pagination.next()
			}}
		>
			<span>
				{$t('next', { ns: 'common' })}
			</span>
			<i class="ti ti-chevron-right text-lg font-bold"></i>
		</PaginationItem>
	</div>
{/if}
