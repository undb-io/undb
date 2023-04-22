<script lang="ts">
	import { page } from '$app/stores'
	import { getTable } from '$lib/context'
	import RecordCard from '$lib/record/RecordCard.svelte'
	import { TableFactory, type IQueryTable, type Records, type Table } from '@undb/core'
	import { Alert, Button, Checkbox, Modal, Spinner } from 'flowbite-svelte'
	import { onMount } from 'svelte'
	import VirtualList from 'svelte-tiny-virtual-list'

	let loading = false
	let open = false

	const table = getTable()
	const tables = $page.data.tables as IQueryTable[]

	export let foreignTableId: string
	export let value: string[] = []
	export let getForeignRecords: () => Promise<Records>

	let foreignTable: Table
	$: {
		if (foreignTableId === $table.id.value) foreignTable = $table
		else {
			const ft = tables.find((t) => t.id === foreignTableId)
			if (ft) foreignTable = TableFactory.fromQuery(ft)
		}
	}

	$: schema = foreignTable.schema.toIdMap()

	onMount(() => {
		if (!value) value = []
	})

	let records: Records = []

	async function initRecords() {
		loading = true
		records = await getForeignRecords()
		loading = false
	}

	$: if (open) foreignTableId, initRecords()
</script>

<Button color="alternative" on:click={() => (open = true)} {...$$restProps}>Select Record</Button>
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
						class="!py-4 w-full shadow-none hover:shadow-md transition hover:border-blue-400 border-2"
						role="button"
					/>
				</Checkbox>
			</div>
		</VirtualList>
	{/if}
</Modal>
