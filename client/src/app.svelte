<script lang="ts">
  import LoadImage from './load-image.svelte';
  import Editor from './editor.svelte';

  let image: HTMLImageElement | null = null;
  function onImageLoaded(img: HTMLImageElement) {
    image = img;
  }
</script>

<h1>Color Fix</h1>
{#if image}
  <Editor {image} />
{:else}
  <LoadImage {onImageLoaded} />
{/if}
