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

<style lang="postcss">
  input {
    border: none;
    outline: none;
    background: none;
    padding: 0;
    display: block;
    height: auto;
    width: 100%;
    background: transparent;
    font-size: 1em;
  }
  input:not([type='file']) {
    display: block;
    border-bottom: 1px solid #ccc;
    max-width: 400px;
    &:focus {
      border-bottom: 1px solid black;
    }
  }
  label {
    display: block;
    margin-bottom: 0.5rem;
    cursor: text;
  }
  label:hover {
    transform: translate3d(-1px, -1px, 0);
    color: blue;
  }
  label:active {
    transform: none;
  }
  button,
  input[type='file']::file-selector-button {
    border: none;
    background: none;
    cursor: pointer;
    outline: none;
    padding: 0;
    font-size: 1em;
    border: 1px solid currentColor;
    border-radius: 3px;
    box-shadow: 3px 3px 0 0 currentColor;
    padding: 0.4em 0.5em;
    font-weight: 600;
    &:hover {
      color: blue;
      transform: translate3d(-1px, -1px, 0);
      box-shadow: 4px 4px 0 0 currentColor;
    }
    &:active {
      transform: none;
      box-shadow: 3px 3px 0 0 currentColor;
    }
  }
</style>
