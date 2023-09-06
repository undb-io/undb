<script lang="ts">
	import * as Alert from '$lib/components/ui/alert'

	export let message: string
</script>

<Alert.Root variant="destructive">
	<Alert.Description>
		{message}
	</Alert.Description>
</Alert.Root>
