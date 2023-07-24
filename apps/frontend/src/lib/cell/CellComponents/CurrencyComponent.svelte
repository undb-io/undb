<script lang="ts">
	export let value: number | undefined | null
	export let symbol: string
</script>

<div class="flex items-center gap-0.5">
	<span>{symbol}</span>
	<span>{value}</span>
</div>
