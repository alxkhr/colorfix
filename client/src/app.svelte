<script lang="ts">
  import LoadImage from './load-image.svelte';
  let image: HTMLImageElement | null = null;
  function onImageLoaded(img: HTMLImageElement) {
    image = img;
  }
</script>

<h1>Color Fix</h1>
{#if image}
  <img src={image.src} alt="Loaded" />
{/if}
{#if !image}
  <LoadImage {onImageLoaded} />
{/if}
