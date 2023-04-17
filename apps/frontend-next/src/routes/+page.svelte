<script lang="ts">
	import { Button, Card, P } from 'flowbite-svelte'
	import { Plus } from 'svelte-heros-v2'
	import type { LayoutData, PageData } from './$types'
	import { createTableHidden } from '$lib/store'

	export let data: LayoutData
</script>

<nav class="bg-white border-b border-gray-200 dark:bg-gray-900">
	<div class="w-full px-5 py-4 flex justify-end" id="navbar-default">
		<Button size="sm" on:click={() => createTableHidden.set(false)}>
			<Plus size="16" class="mr-3" />
			create new table</Button
		>
	</div>
</nav>

<main class="container p-10 grid grid-cols-4 gap-4">
	{#each data.tables as table}
		<Card href={`/t/${table.id}`}>
			<h5 class="font-semibold">{table.name}</h5>
		</Card>
	{/each}
</main>
