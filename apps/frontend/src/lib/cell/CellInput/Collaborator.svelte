<script lang="ts">
	import UsersPicker from './UsersPicker.svelte'

	export let value: string[] | undefined
</script>

<UsersPicker bind:value {...$$restProps} />
