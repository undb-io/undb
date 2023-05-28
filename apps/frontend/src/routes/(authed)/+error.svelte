<script lang="ts">
	import { page } from '$app/stores'
	import { Alert } from 'flowbite-svelte'
</script>

<div class="w-full h-full flex items-center justify-center">
	<Alert color="red" class="w-[300px]">
		{$page.error?.message}
	</Alert>
</div>
