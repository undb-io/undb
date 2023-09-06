<script lang="ts">
	import { cn } from '$lib/utils'
</script>

<div
	class={cn(
		'fixed flex items-center p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-lg shadow-md border bottom-5 right-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800 z-[999999999]',
		$$restProps.class,
	)}
	role="alert"
>
	<div class="flex items-center space-x-5 justify-between">
		<slot />
	</div>
</div>
