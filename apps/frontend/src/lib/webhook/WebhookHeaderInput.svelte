<script lang="ts">
	import { Button, Input } from 'flowbite-svelte'

	export let value: Record<string, string> = {}
	let headers: { key: string; value: string }[] = Object.entries(value).map(([key, value]) => ({ key, value }))

	$: value = headers
		.filter((header) => !!header.key && !!header.value)
		.reduce((prev, curr) => {
			prev[curr.key] = curr.value
			return prev
		}, {} as Record<string, string>)

	const addHeader = () => {
		headers = [...headers, { key: '', value: '' }]
	}

	const removeHeader = (i: number) => {
		headers = headers.filter((_, index) => i !== index)
	}
</script>

<div class="space-y-3">
	{#if headers.length}
		<div class="space-y-2">
			{#each headers as header, i}
				<div class="flex gap-2">
					<div class="flex-1 grid grid-cols-2 gap-4">
						<Input size="sm" bind:value={header.key} />
						<Input size="sm" bind:value={header.value} />
					</div>
					<button class="text-gray-600" on:click|preventDefault|stopPropagation={() => removeHeader(i)}>
						<i class="ti ti-trash" />
					</button>
				</div>
			{/each}
		</div>
	{/if}
	<Button size="xs" color="light" on:click={() => addHeader()}>Add Header</Button>
</div>
