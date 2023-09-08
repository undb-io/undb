<script lang="ts">
	import { Checkbox } from '$components/ui/checkbox'

	export let value: boolean = false
	export let readonly: boolean = false
</script>

<Checkbox bind:checked={value} disabled={readonly} class="max-w-xs" />
