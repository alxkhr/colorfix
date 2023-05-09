<script lang="ts">
  import { onMount } from 'svelte';
  import { fixColorFilter } from './filter/fix-color';
  let canvas: HTMLCanvasElement | null = null;
  export let image: HTMLImageElement;
  let drawFn = () => {};
  let targetHueShift = 0.5;
  let targetValue = 1.0;
  let targetSaturation = 1.0;
  let sourceHue = 0.0;
  let sourceHueRange = 0.2;
  let sourceSVRange = 0.5;
  onMount(() => {
    drawFn = () =>
      fixColorFilter(canvas, image)(
        targetHueShift,
        targetValue,
        targetSaturation,
        sourceHue,
        sourceHueRange,
        sourceSVRange,
      );
    drawFn();
  });
  function onChange() {
    drawFn();
  }
  function onSave() {
    drawFn();
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
<h2>Target</h2>
<label for="targetHueShift">Hue Shift</label>
<input
  id="targetHueShift"
  type="range"
  min="0"
  max="1"
  step="0.01"
  bind:value={targetHueShift}
  on:change={onChange}
/>
<label for="targetValue">Value</label>
<input
  id="targetValue"
  type="range"
  min="0"
  max="1"
  step="0.01"
  bind:value={targetValue}
  on:change={onChange}
/>
<label for="targetSaturation">Saturation</label>
<input
  id="targetSaturation"
  type="range"
  min="0"
  max="1"
  step="0.01"
  bind:value={targetSaturation}
  on:change={onChange}
/>
<h2>Source</h2>
<label for="sourceHue">Hue</label>
<input
  id="sourceHue"
  type="range"
  min="0"
  max="1"
  step="0.01"
  bind:value={sourceHue}
  on:change={onChange}
/>
<label for="sourceHueRange">Hue Range</label>
<input
  id="sourceHueRange"
  type="range"
  min="0"
  max="1"
  step="0.01"
  bind:value={sourceHueRange}
  on:change={onChange}
/>
<label for="sourceSVRange">SV Range</label>
<input
  id="sourceSVRange"
  type="range"
  min="0"
  max="1"
  step="0.01"
  bind:value={sourceSVRange}
  on:change={onChange}
/>
<button on:click={onSave}>Save</button>
