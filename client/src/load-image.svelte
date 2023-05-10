<script lang="ts">
  let url = '';
  export let onImageLoaded: (img: HTMLImageElement) => void;

  function loadImage(src: string, crossOrigin = false) {
    const img = new Image();
    img.crossOrigin = crossOrigin ? 'anonymous' : '';
    img.src = src;
    img.onload = () => {
      onImageLoaded(img);
    };
  }

  function onLoadURL() {
    if (url) {
      loadImage(url, true);
    }
  }

  function chooseFile(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        loadImage(reader.result as string);
      };
    }
  }
</script>

<div>
  <label for="url">Image URL:</label>
  <input type="text" id="url" bind:value={url} />
  <button on:click={onLoadURL}>Load Image</button>
</div>

<div>
  <label for="file">Image file:</label>
  <input type="file" id="file" on:change={chooseFile} accept="image/*" />
</div>
