<script lang="ts">
	export let value: string | undefined = undefined
</script>

<div class="inline-flex items-center gap-2 w-full border px-2 text-sm">
	<input bind:value class="rounded-sm" {...$$restProps} autocomplete="off" type="color" />
	<span>{value ?? ''}</span>
</div>
