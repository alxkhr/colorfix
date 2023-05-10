<script lang="ts">
  let url = '';
  export let onImageLoaded: (img: HTMLImageElement) => void;

  const loadImage = () => {
    if (url) {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        onImageLoaded(img);
      };
    }
  };

  const chooseFile = (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          onImageLoaded(img);
        };
      };
    }
  };
</script>

<div>
  <label for="url">Image URL:</label>
  <input type="text" id="url" bind:value={url} />
  <button on:click={loadImage}>Load Image</button>
</div>

<div>
  <label for="file">Image file:</label>
  <input type="file" id="file" on:change={chooseFile} accept="image/*" />
</div>
