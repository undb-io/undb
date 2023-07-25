<script lang="ts">
	export let value: string | null
</script>

{#if value}
	<span class="inline-flex items-center gap-2">
		<span class="inline-block w-4 h-4 rounded-md" style={`background-color: ${value};`} />
		<span>{value}</span>
	</span>
{/if}
