<script lang="ts">
	import { page } from '$app/stores'
	import DefaultError from '$lib/errors/DefaultError.svelte'
	import TableNotFound from '$lib/errors/TableNotFound.svelte'
	import { ERR_TABLE_NODE_FOUND } from '@undb/core'
	import type { ComponentType } from 'svelte'

	$: err = $page.error as any

	const map: Record<string, ComponentType> = {
		[ERR_TABLE_NODE_FOUND]: TableNotFound,
	}
</script>

{#if err}
	<div class="w-full h-full flex items-center justify-center">
		<div class="w-[300px]">
			<svelte:component this={map[err.code] ?? DefaultError} message={err.message} />
		</div>
	</div>
{/if}
