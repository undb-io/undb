<script lang="ts">
	import { Button, Card } from 'flowbite-svelte'
	import type { LayoutData } from './$types'
	import { createTableOpen } from '$lib/store/modal'
	import Empty from '$lib/table/Empty.svelte'
	import { t } from '$lib/i18n'

	export let data: LayoutData
</script>

<nav class="bg-white border-b border-gray-200 dark:bg-gray-900">
	<div class="w-full px-5 py-4 flex justify-end" id="navbar-default">
		<Button size="sm" on:click={() => createTableOpen.set(true)}>
			<i class="ti ti-plus text-sm mr-3" />
			{$t('Create New Table')}</Button
		>
	</div>
</nav>

{#if !!data.tables.length}
	<main class="w-full p-10 grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-4">
		{#each data.tables as table}
			<Card href={`/t/${table.id}`}>
				<h5 class="font-semibold">{table.name}</h5>
			</Card>
		{/each}
	</main>
{:else}
	<Empty />
{/if}
