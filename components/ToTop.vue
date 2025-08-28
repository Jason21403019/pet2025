<template>
  <transition name="fade">
    <button
      @click="scrollToTop"
      class="totop"
      :class="{ 'totop--at-bottom': isNearBottom }"
    >
      <!-- <img
        :src="getImgPath('toTop_plus.png')"
        alt="回到頂部"
        class="totop__image"
      /> -->
      <img src="/imgs/toTop_plus.png" alt="回到頂部" class="totop__image" />
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useImagePath } from "~/composables/useImagePath.js";

const isNearBottom = ref(false);

function getImgPath(filename) {
  const config = useRuntimeConfig();
  const baseURL = config.app.baseURL || "/";

  if (filename.endsWith(".png")) {
    return useImagePath(filename);
  }

  return `${baseURL}imgs/${filename}`.replace(/\/+/g, "/");
}

const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const clientHeight = window.innerHeight;

  isNearBottom.value = scrollHeight - scrollTop - clientHeight < 100;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss" scoped>
.totop {
  position: fixed;
  bottom: 10px;
  right: -10px;
  width: 200px;
  border: none;
  border-radius: 0;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: none;
  z-index: 999;

  @media (max-width: 1110px) {
    width: 150px;
  }

  @media (max-width: 768px) {
    width: 110px;
  }

  @media (max-width: 480px) {
    bottom: 90px;
    width: 200px;
  }

  @media (max-width: 460px) {
    width: 75vw;
    bottom: 0px;
    right: 50%;
    transform: translateX(50%);
    &.totop--at-bottom {
      bottom: 85px;
    }
  }
  &:hover {
    filter: brightness(1.1);
    @media (min-width: 461px) {
      transform: translateY(-3px) scale(1.05);
    }
    @media (max-width: 460px) {
      transform: translateX(50%) translateY(-3px) scale(1.05);
    }
  }

  &:active {
    @media (min-width: 461px) {
      transform: translateY(-1px) scale(1.02);
    }
    @media (max-width: 460px) {
      transform: translateX(50%) translateY(-1px) scale(1.02);
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: all 0.3s ease;
    @media (max-width: 480px) {
      content: url("/imgs/toTop_plus_m.png");
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
