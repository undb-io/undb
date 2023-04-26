<script lang="ts">
	import cx from 'classnames'
	import { page } from '$app/stores'
	import RecordCard from '$lib/record/RecordCard.svelte'
	import {
		TableFactory,
		type IQueryTable,
		type Records,
		type Table,
		Record,
		type ReferenceFieldTypes,
	} from '@undb/core'
	import { Alert, Button, Checkbox, CloseButton, Modal, Spinner } from 'flowbite-svelte'
	import VirtualList from 'svelte-tiny-virtual-list'
	import { onMount, tick } from 'svelte'
	import { getTable } from '$lib/store/table'
	import { writable } from 'svelte/store'

	let loading = false
	let initialLoading = false
	let open = false

	const table = getTable()
	const tables = $page.data.tables as IQueryTable[]

	export let foreignTableId: string
	export let value: string[] = []
	$: if (!value) value = []
	export let field: ReferenceFieldTypes
	export let record: Record | undefined = undefined
	export let getForeignRecords: () => Promise<Records>
	export let getInitRecords: () => Promise<Records>

	let records = writable<Records>([])
	const recordsMap = writable(new Map<string, Record>())

	async function getInitial() {
		if (!open) {
			initialLoading = true
			records.set(await getInitRecords())

			initialLoading = false
		}
	}

	$: value, getInitial()

	let foreignTable: Table
	$: {
		if (foreignTableId === $table.id.value) foreignTable = $table
		else {
			const ft = tables.find((t) => t.id === foreignTableId)
			if (ft) foreignTable = TableFactory.fromQuery(ft)
		}
	}

	$: schema = foreignTable.schema

	$: {
		for (const record of $records) {
			recordsMap.set($recordsMap.set(record.id.value, record))
		}
	}

	async function getForeign() {
		loading = true
		records.set(await getForeignRecords())
		loading = false
	}

	function remove(recordId: string) {
		value = value?.filter((r) => r !== recordId) ?? []
	}

	$: if (open) getForeign()
	$: selected = value?.map((r) => $recordsMap.get(r)!) ?? []
</script>

<div class="space-y-2 max-h-96">
	<div class="space-y-2 h-full overflow-auto">
		{#each selected as record}
			{#if !!record}
				<div class="group relative">
					<RecordCard
						{field}
						{record}
						{schema}
						class="!py-3 !sm:py-4 w-full shadow-none hover:shadow-md transition hover:border-blue-400 border-2 !max-w-none"
						role="button"
					/>
					<CloseButton
						on:click={() => remove(record.id.value)}
						class="absolute z-50 right-0 top-[50%] text-sm translate-y-[-55%] translate-x-[-50%] hidden group-hover:block text-gray-500"
					/>
				</div>
			{/if}
		{/each}
	</div>
	<Button
		color="alternative"
		on:click={() => (open = true)}
		{...$$restProps}
		class={cx('space-x-2', $$restProps.class)}
	>
		{#if initialLoading}
			<Spinner size="4" />
		{:else}
			<i class="ti ti-plus" />
			<span> Add Record </span>
		{/if}
	</Button>
	<Modal title="Select Record" bind:open size="md" class="w-[700px] h-[600px]">
		{#if loading}
			<div class="flex w-full h-full items-center justify-center">
				<Spinner />
			</div>
		{:else if !$records.length}
			<Alert>no records available</Alert>
		{:else}
			<VirtualList height={600} width="100%" itemCount={$records.length} itemSize={62}>
				<div slot="item" let:index let:style {style} class="flex items-stretch mb-2">
					<Checkbox
						inline
						value={$records[index].id.value}
						bind:group={value}
						custom
						on:change={() => (open = false)}
						class="w-full"
					>
						<RecordCard
							{field}
							{schema}
							record={$records[index]}
							class="!py-4 w-full shadow-none hover:shadow-md transition hover:border-blue-400 border-2 !max-w-none"
							role="button"
						/>
					</Checkbox>
				</div>
			</VirtualList>
		{/if}
	</Modal>
</div>
