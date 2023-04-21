<script lang="ts">
	import { goto } from '$app/navigation'
	import { getTable } from '$lib/context'
	import { IconChevronLeft } from '@tabler/icons-svelte'
	import { Button, P } from 'flowbite-svelte'

	const back = () => goto('/')

	const table = getTable()
</script>

<div class="flex items-center gap-2">
	<Button outline pill color="light" size="xs" class="h-[26px] w-[26px] rounded-full gap-2 !px-1" on:click={back}>
		<IconChevronLeft size={16} />
	</Button>

	<P size="sm" color="text-gray-700">{$table.name.value}</P>
</div>
