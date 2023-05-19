<script lang="ts">
  import LoadImage from './load-image.svelte';
  import Editor from './editor.svelte';

  let image: HTMLImageElement | null = null;
  function onImageLoaded(img: HTMLImageElement) {
    image = img;
  }
</script>

<h1>colorfix</h1>
{#if image}
  <Editor {image} />
{:else}
  <LoadImage {onImageLoaded} />
{/if}

<style>
  h1 {
    text-align: center;
    width: 100%;
    display: block;
  }
</style>
