<script lang="ts">
  import { onMount } from 'svelte';
  import { fixColorFilter } from './filter/fix-color';
  let canvas: HTMLCanvasElement | null = null;
  export let image: HTMLImageElement;
  onMount(() => {
    fixColorFilter(canvas, image);
  });
</script>

<canvas bind:this={canvas} />
