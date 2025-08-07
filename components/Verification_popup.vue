<template>
  <div
    v-if="isVisible"
    class="verification__overlay"
    :class="{ 'verification__overlay--closing': isClosing }"
  >
    <div
      class="verification__popup"
      :class="{ 'verification__popup--closing': isClosing }"
    >
      <div class="verification__popup-inner">
        <!-- 內容區 -->
        <div class="verification__content">
          <!-- 標題 -->
          <div class="verification__title">安全驗證</div>

          <!-- 說明文字 -->
          <div class="verification__description">
            請先完成下方安全驗證以繼續填寫問卷
          </div>

          <!-- Turnstile 容器 -->
          <div
            id="turnstile-container"
            class="verification__turnstile-wrapper"
          ></div>

          <!-- 提示文字 -->
          <div class="verification__hint">驗證完成後將自動進行問卷</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "opened"]);

const isClosing = ref(false);

watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue) {
      setTimeout(() => {
        emit("opened");
      });
    }
  },
);

onUnmounted(() => {
  if (
    typeof window !== "undefined" &&
    window.turnstile &&
    window.turnstileWidgetId
  ) {
    try {
      window.turnstile.remove(window.turnstileWidgetId);
    } catch (e) {
      console.log("清理 Turnstile 時發生錯誤:", e);
    }
  }
});
</script>

<style lang="scss" scoped>
.verification {
  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(168, 168, 168, 0.2);
    backdrop-filter: blur(2px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 12px;
    animation: overlayFadeIn 0.3s ease-out;

    &--closing {
      animation: overlayFadeOut 0.3s ease-out;
    }
  }

  &__popup {
    background: #2f75c9; // 修改：和Universal一樣的背景色
    background-image: url("/imgs/noticePopup_bg.png"); // 修改：使用相同的背景圖片
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border: none; // 修改：移除邊框
    border-radius: 25px;
    // 修改：動態調整彈窗大小
    min-width: 300px;
    max-width: 600px;
    width: fit-content;
    min-height: 200px;
    max-height: 500px;
    height: fit-content;
    position: relative;
    animation: modalBounceIn 0.3s ease-out;
    padding: 20px;
    z-index: 1001;

    &--closing {
      animation: modalBounceOut 0.25s ease-in;
    }

    @media (max-width: 768px) {
      min-width: 280px;
      max-width: 90vw;
      min-height: 180px;
      max-height: 80vh;
    }

    @media (max-width: 480px) {
      min-width: 250px;
      max-width: 95vw;
      min-height: 160px;
      max-height: 75vh;
      border: none;
    }

    @media (max-width: 360px) {
      padding: 10px;
      min-width: 220px;
      min-height: 140px;
    }
    // 移除::before和::after裝飾
  }

  &__popup-inner {
    position: relative;
    padding: 40px 30px;
    border-radius: 20px;
    border: none;
    z-index: 1;
    z-index: 1002;

    @media (max-width: 768px) {
      padding: 30px 25px;
    }
    @media (max-width: 480px) {
      padding: 25px 20px;
    }
    @media (max-width: 360px) {
      padding: 20px 15px;
    }
    // 移除::before裝飾
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #fff;
    padding: 10px 0;
    width: 100%;
    // 移除::before裝飾
  }

  &__title {
    font-size: 24px;
    font-weight: bold;
    color: white;
    text-align: center;
    margin-bottom: 15px;
    line-height: 1.4;

    @media (max-width: 480px) {
      font-size: 20px;
      margin-bottom: 12px;
    }
  }

  &__description {
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 15px;
    color: #fff;
    word-wrap: break-word;
    max-width: 100%;

    @media (max-width: 480px) {
      font-size: 14px;
      margin-bottom: 12px;
    }
  }

  &__turnstile-wrapper {
    margin: 15px auto;
    min-height: 65px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    max-width: 250px;
    transform: scale(0.9);
    z-index: 1003;

    @media (max-width: 480px) {
      width: 100%;
      transform: scale(0.8);
      transform-origin: center;
      margin: 12px auto;
    }
  }

  &__hint {
    font-size: 14px;
    line-height: 1.5;
    margin-top: 12px;
    color: #e0e0e0;
    font-style: italic;

    @media (max-width: 480px) {
      font-size: 13px;
      margin-top: 10px;
    }
  }
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes overlayFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes modalBounceIn {
  0% {
    opacity: 0;
    transform: translateY(-50px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes modalBounceOut {
  0% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(-20px) scale(0.9);
  }
}
</style>
