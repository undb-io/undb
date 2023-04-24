<script lang="ts">
	import cx from 'classnames'
	import { page } from '$app/stores'
	import RecordCard from '$lib/record/RecordCard.svelte'
	import { TableFactory, type IQueryTable, type Records, type Table, Record } from '@undb/core'
	import { Alert, Button, Checkbox, CloseButton, Modal, Spinner } from 'flowbite-svelte'
	import VirtualList from 'svelte-tiny-virtual-list'
	import { IconPlus } from '@tabler/icons-svelte'
	import { onMount } from 'svelte'
	import { getTable } from '$lib/store/table'

	let loading = false
	let open = false

	const table = getTable()
	const tables = $page.data.tables as IQueryTable[]

	export let foreignTableId: string
	export let value: string[] = []
	const recordsMap = new Map<string, Record>()
	export let getForeignRecords: () => Promise<Records>

	onMount(() => {
		value ||= []
	})

	let foreignTable: Table
	$: {
		if (foreignTableId === $table.id.value) foreignTable = $table
		else {
			const ft = tables.find((t) => t.id === foreignTableId)
			if (ft) foreignTable = TableFactory.fromQuery(ft)
		}
	}

	$: schema = foreignTable.schema.toIdMap()

	let records: Records = []

	$: {
		for (const record of records) {
			recordsMap.set(record.id.value, record)
		}
	}

	async function initRecords() {
		loading = true
		records = await getForeignRecords()
		loading = false
	}

	function remove(recordId: string) {
		value = value?.filter((r) => r !== recordId) ?? []
	}

	$: if (open) foreignTableId, initRecords()
	$: selected = value?.map((r) => recordsMap.get(r)!) ?? []
</script>

<div class="space-y-2">
	<div class="space-y-2">
		{#each selected as record}
			{#if !!record}
				<div class="group relative">
					<RecordCard
						{record}
						{schema}
						class="!py-4 !sm:py-4 w-full shadow-none hover:shadow-md transition hover:border-blue-400 border-2 max-w-none"
						role="button"
					/>
					<CloseButton
						on:click={() => remove(record.id.value)}
						class="absolute right-0 top-0 text-sm translate-y-[-50%] translate-x-[50%] hidden group-hover:block text-gray-500"
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
		<IconPlus />
		<span> Add Record </span>
	</Button>
	<Modal title="Select Record" bind:open size="md" class="w-[700px] h-[600px]">
		{#if loading}
			<div class="flex w-full h-full items-center justify-center">
				<Spinner />
			</div>
		{:else if !records.length}
			<Alert>no records available</Alert>
		{:else}
			<VirtualList height={600} width="100%" itemCount={records.length} itemSize={62}>
				<div slot="item" let:index let:style {style} class="w-full mb-2">
					<Checkbox
						inline
						value={records[index].id.value}
						bind:group={value}
						custom
						on:change={() => (open = false)}
						class="w-full"
					>
						<RecordCard
							{schema}
							record={records[index]}
							class="!py-4 w-full shadow-none hover:shadow-md transition hover:border-blue-400 border-2 max-w-none"
							role="button"
						/>
					</Checkbox>
				</div>
			</VirtualList>
		{/if}
	</Modal>
</div>
