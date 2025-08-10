<template>
  <div
    v-if="isVisible"
    class="already-played__overlay"
    :class="{ 'already-played__overlay--closing': isClosing }"
    @click.self="closeModal"
  >
    <div
      class="already-played__popup"
      :class="{ 'already-played__popup--closing': isClosing }"
    >
      <!-- 關閉按鈕 -->
      <button class="already-played__close-btn" @click="closeModal">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <!-- 將文字和按鈕group在一起 -->
      <div class="already-played__content-group">
        <div class="already-played__text">
          <p class="already-played__title">你已填寫過問卷囉</p>
          <p class="already-played__subtitle">每個帳號都有1次填寫機會</p>
          <p class="already-played__subtitle">趕快揪親朋好友一起參與</p>
        </div>
        <div class="already-played__buttons">
          <!-- 修改：使用a標籤直接跳轉 -->
          <a
            href="https://lab-event.udn.com/bd_pet2025"
            target="_blank"
            rel="noopener noreferrer"
            class="already-played__btn already-played__btn--share"
          >
            分享
          </a>
          <a
            href="https://udn.com/news/cate/2/7065"
            target="_blank"
            rel="noopener noreferrer"
            class="already-played__btn already-played__btn--explore"
          >
            揭開更多<br />寵物秘密
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  alreadyPlayedData: {
    type: Object,
    default: () => ({}),
  },
  totalPlayCount: {
    type: Number,
    default: 0,
  },
  isDevelopment: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const isClosing = ref(false);

const closeModal = () => {
  isClosing.value = true;
  setTimeout(() => {
    isClosing.value = false;
    emit("close");
  });
};

// 移除handleShare和handleExplore函數，不需要了
</script>

<style lang="scss" scoped>
.already-played {
  &__overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(168, 168, 168, 0.2); // 修改：和Banner一樣的遮罩
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
    background-image: url("/imgs/loginPop.png"); // 修改：使用和Banner一樣的背景圖片
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-color: transparent;
    border-radius: 0;
    padding: 0;
    max-width: 458px; // 修改：使用圖片原始寬度
    width: 90%;
    height: 646px; // 修改：使用圖片原始高度
    max-height: 90vh;
    text-align: center;
    box-shadow: none;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    animation: modalBounceIn 0.3s ease-out;

    &--closing {
      animation: modalBounceOut 0.25s ease-in;
    }

    @media (max-width: 768px) {
      max-width: 350px;
      height: 494px;
      max-height: 85vh;
    }

    @media (max-width: 480px) {
      max-width: 275px;
      height: 388px;
      max-height: 80vh;
    }

    @media (max-width: 360px) {
      max-width: 229px;
      height: 323px;
      max-height: 75vh;
    }
  }

  &__close-btn {
    position: absolute;
    top: 15px; // 修改：和Banner一樣的位置
    right: 15px;
    width: 40px;
    height: 40px;
    border: 2px solid white; // 修改：和Banner一樣的樣式
    background: #f2ee72;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: white;
    z-index: 10;

    @media (max-width: 480px) {
      top: 10px;
      right: 10px;
      width: 35px;
      height: 35px;
    }

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(242, 238, 114, 0.4);
    }
  }

  // 新增：內容群組樣式（和Banner一樣）
  &__content-group {
    position: absolute;
    top: 60%; // 和Banner一樣的位置
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 90%;
    max-width: 400px;
  }

  &__text {
    margin-bottom: 0;
    width: 100%;

    p {
      margin: 2px 0;
      line-height: 1.4;
      color: #2f75c9;
      text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
    }
  }

  &__title {
    font-size: 24px; // 修改：標題大小
    font-weight: bold;
  }

  &__subtitle {
    font-size: 20px; // 修改：副標題大小
    font-weight: normal;
  }

  &__buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap; // 小螢幕上允許換行
  }

  &__btn {
    // 修改：a標籤的樣式，和button一樣
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    padding: 4px 6px; // 修改：改成4px 6px
    border: 2px solid #2f75c9;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 100px;
    background: transparent;
    color: #2f75c9;
    white-space: nowrap;
    line-height: 1.2;

    &:hover {
      background: #2f75c9;
      color: #fbed1d;
      border-color: #2f75c9;
      text-decoration: none;
    }

    &:active {
      transform: translateY(-1px);
    }

    @media (max-width: 480px) {
      padding: 4px 6px; // 修改：手機版也改成4px 6px
      font-size: 14px;
      min-width: 80px;
    }
  }

  // 響應式調整（和Banner一樣）
  @media (max-width: 768px) {
    &__content-group {
      gap: 15px;
      width: 85%;
      max-width: 300px;
    }

    &__title {
      font-size: 18px;
    }

    &__subtitle {
      font-size: 16px;
    }
  }

  @media (max-width: 480px) {
    &__content-group {
      gap: 12px;
      width: 80%;
      max-width: 220px;
    }

    &__title {
      font-size: 16px;
    }

    &__subtitle {
      font-size: 14px;
    }
  }

  @media (max-width: 360px) {
    &__content-group {
      width: 75%;
      max-width: 180px;
    }

    &__title {
      font-size: 14px;
    }

    &__subtitle {
      font-size: 13px;
    }
  }
}

// 動畫keyframes（和Banner一樣）
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
