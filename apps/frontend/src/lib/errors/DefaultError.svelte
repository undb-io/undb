<script lang="ts">
	import { Alert } from 'flowbite-svelte'

	export let message: string
</script>

<Alert color="red" class="w-full">
	{message}
</Alert>
