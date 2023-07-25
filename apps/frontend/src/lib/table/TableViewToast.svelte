<script lang="ts">
	import { t } from '$lib/i18n'
	import { confirmBulkDeleteRecords } from '$lib/store/modal'
	import { recordSelection, selectedCount, selectedRecords } from '$lib/store/record'
	import { getTable, getView, q, recordHash } from '$lib/store/table'
	import { trpc } from '$lib/trpc/client'
	import { Toast, P, Button, Spinner, Chevron, Dropdown, DropdownItem, ButtonGroup } from 'flowbite-svelte'
	import { quintOut } from 'svelte/easing'
	import { slide } from 'svelte/transition'

	const table = getTable()
	const view = getView()

	$: data = trpc().record.list.query(
		{ tableId: $table.id.value, viewId: $view.id.value, q: $q },
		{ enabled: false, refetchOnMount: false, refetchOnWindowFocus: true, queryHash: $recordHash },
	)

	const bulkDeleteRecordsMutation = trpc().record.bulkDelete.mutation({
		async onSuccess(data, variables, context) {
			recordSelection.reset()
			await $data.refetch()
		},
	})

	const bulkDuplicateRecordsMutation = trpc().record.bulkDuplicate.mutation({
		async onSuccess(data, variables, context) {
			recordSelection.reset()
			await $data.refetch()
		},
	})

	const duplicate = () => {
		$bulkDuplicateRecordsMutation.mutate({
			tableId: $table.id.value,
			ids: $selectedRecords as [string, ...string[]],
		})
	}

	export let open: boolean
</script>

<Toast
	{open}
	color="none"
	position="bottom-right"
	class="z-30 shadow-xl bg-white border border-slate-200 !w-[500px] !max-w-xl"
	transition={slide}
	params={{ delay: 100, duration: 200, easing: quintOut }}
>
	<div class="flex items-center space-x-5 justify-between">
		<P class="text-sm !text-gray-700 dark:!text-gray-100">{@html $t('Selected N Records', { n: $selectedCount })}</P>

		<ButtonGroup size="xs">
			<Button
				size="xs"
				color="blue"
				class="inline-flex gap-2"
				disabled={$bulkDuplicateRecordsMutation.isLoading}
				on:click={duplicate}
			>
				{#if $bulkDuplicateRecordsMutation.isLoading}
					<Spinner class="mr-3" size="4" />
				{:else}
					<i class="ti ti-copy text-lg" />
				{/if}
				{$t('Duplicate Selected Record')}
			</Button>
			<Button size="xs" color="blue" class="!pl-1">
				<Chevron />
			</Button>
			<Dropdown style="z-index: 50;" placement="top" class="w-48">
				<DropdownItem class="text-red-400" on:click={() => ($confirmBulkDeleteRecords = true)}>
					{#if $bulkDeleteRecordsMutation.isLoading}
						<Spinner class="mr-3" size="4" />
					{:else}
						<i class="ti ti-trash text-lg" />
					{/if}
					{$t('Delete Selected Record')}
				</DropdownItem>
			</Dropdown>
		</ButtonGroup>
	</div>
</Toast>
