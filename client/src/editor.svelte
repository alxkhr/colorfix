<script lang="ts">
  import { onMount } from 'svelte';
  import { fixColorFilter } from './filter/fix-color';
  let canvas: HTMLCanvasElement | null = null;
  export let image: HTMLImageElement;
  let drawFn: (value: number) => void = () => {};
  let targetHueShift = 0.5;
  onMount(() => {
    drawFn = fixColorFilter(canvas, image);
    drawFn(targetHueShift);
  });
  function onChange() {
    drawFn(targetHueShift);
  }
  function onSave() {
    drawFn(targetHueShift);
    requestAnimationFrame(() => {
      const link = document.createElement('a');
      link.download = 'image.png';
      const dataURL = canvas.toDataURL();
      link.href = dataURL;
      link.click();
    });
  }
</script>

<canvas bind:this={canvas} />
<input
  type="range"
  min="0"
  max="1"
  step="0.01"
  bind:value={targetHueShift}
  on:change={onChange}
/>
<button on:click={onSave}>Save</button>
