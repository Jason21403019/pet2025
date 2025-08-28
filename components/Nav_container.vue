<template>
  <div class="container">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.container {
  max-width: 1920px;
  width: 100%;
  margin: 0 auto;
  padding: 12px;
  box-sizing: border-box;

  @media (max-width: 480px) {
    padding: 4px;
  }

  @media (max-width: 375px) {
    padding: 4px;
  }
  @media (max-width: 360px) {
    padding: 1px;
  }
}
</style>
