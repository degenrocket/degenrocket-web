<template>
  <div class="SpinnerModal">
    <div class="SpinnerContainer">
      <svg viewBox="0 0 100 100">
        <defs />
        <circle class="Spinner" style="fill:transparent;stroke:purple;stroke-width: 7px;stroke-linecap: round;" cx="50" cy="50" r="45" />
      </svg>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style scoped>

.SpinnerModal {
  display: block;
  position: fixed;
}

.SpinnerContainer {
  margin-top: 1em;
  margin-left: 1em;
  width: 2em;
  height: 2em;
}

@keyframes animation {
  0% {
    stroke-dasharray: 1 98;
    stroke-dashoffset: -105;
  }
  50% {
    stroke-dasharray: 80 10;
    stroke-dashoffset: -160;
  }
  100% {
    stroke-dasharray: 1 98;
    stroke-dashoffset: -300;
  }
}

.Spinner {
  transform-origin: center;
  animation-name: animation;
  animation-duration: 1.2s;
  animation-timing-function: cubic-bezier;
  animation-iteration-count: infinite;
}
</style>
