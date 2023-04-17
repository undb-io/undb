<script lang="ts">
	import { goto } from '$app/navigation'
	import { IconChevronLeft } from '@tabler/icons-svelte'
	import { Button, P } from 'flowbite-svelte'

	const back = () => goto('/')
</script>

<div class="flex items-center gap-2">
	<Button outline pill color="light" size="xs" class="h-[26px] gap-2 !px-1" on:click={back}>
		<IconChevronLeft size={16} />
	</Button>

	<P size="sm" color="text-gray-700">tablename placeholder</P>
</div>
