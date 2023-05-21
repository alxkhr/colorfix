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
    } else {
      // focus the input
      document.getElementById('url').focus();
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

<div class="container">
  <input class="new" type="text" id="url" bind:value={url} />
  <button on:click={onLoadURL}>LOAD</button>
  <input type="file" id="file" on:change={chooseFile} accept="image/*" />
  <button class="new" on:click={() => document.getElementById('file').click()}
    >BROWSE</button
  >
</div>

<style lang="postcss">
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    & > * {
      margin-bottom: 1rem;
    }
  }
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
    display: block;
    max-width: 400px;
    border-bottom: 1px solid #ccc;
    &:focus {
      border-bottom: 1px solid black;
    }
  }
  button {
    border: none;
    background: none;
    outline: none;
    padding: 0;
    font-size: 1em;
    border: 1px solid currentColor;
    border-radius: 3px;
    box-shadow: 3px 3px 0 0 currentColor;
    padding: 0.4em 0.5em;
    font-weight: 600;
    min-width: 300px;
    cursor: pointer;
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
  input[type='file'] {
    display: none;
  }
  .new {
    margin-top: 2rem;
  }
</style>
