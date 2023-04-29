<script lang="ts">
	export let value: string | undefined = undefined
</script>

<div class="inline-flex gap-2">
	<input bind:value class="rounded-sm" {...$$restProps} autocomplete="off" type="color" />
	<span>{value ?? ''}</span>
</div>
