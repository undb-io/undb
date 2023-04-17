<script lang="ts">
	import { getView } from '$lib/context'
	import ViewIcon from '$lib/view/ViewIcon.svelte'
	import { Button, Chevron } from 'flowbite-svelte'

	const view = getView()
</script>

<Button size="xs" color="alternative" class="h-[26px] !rounded-sm gap-2">
	<ViewIcon type={$view.displayType} />
	<Chevron>{$view.name.value}</Chevron></Button
>
