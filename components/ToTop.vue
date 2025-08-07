<template>
  <transition name="fade">
    <button v-if="isVisible" @click="scrollToTop" class="totop">
      <img src="/imgs/toTop_btn.png" alt="回到頂部" class="totop__image" />
    </button>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// 狀態管理
const isVisible = ref(false);

// 監聽滾動事件
const handleScroll = () => {
  isVisible.value = window.scrollY > 300;
};

// 滾動到頂部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// 生命週期
onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss" scoped>
.totop {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px; // 修改：稍微增加尺寸以適應圖片
  height: 60px; // 修改：稍微增加尺寸以適應圖片
  border: none;
  border-radius: 0; // 修改：移除圓角，讓圖片完整顯示
  background: transparent; // 修改：透明背景，讓圖片顯示
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: none; // 修改：移除陰影，圖片本身可能有設計
  z-index: 999;

  @media (max-width: 1180px) {
    bottom: 300px;
  }
  @media (max-width: 992px) {
    bottom: 230px;
  }
  @media (max-width: 768px) {
    bottom: 320px;
    width: 50px; // 小螢幕上稍微縮小
    height: 50px;
  }
  @media (max-width: 480px) {
    bottom: 230px;
    width: 45px;
    height: 45px;
  }
  @media (max-width: 410px) {
    right: 12px;
    bottom: 190px;
    width: 40px;
    height: 40px;
  }
  @media (max-width: 360px) {
    right: 12px;
    bottom: 170px;
    width: 35px;
    height: 35px;
  }

  &:hover {
    transform: translateY(-3px) scale(1.05); // 修改：hover效果調整
    filter: brightness(1.1); // 新增：hover時稍微增亮
  }

  &:active {
    transform: translateY(-1px) scale(1.02); // 修改：active效果調整
  }

  // 新增：圖片樣式
  &__image {
    width: 100%;
    height: 100%;
    object-fit: contain; // 保持圖片比例
    transition: all 0.3s ease;
  }
}

// 淡入淡出動畫
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
