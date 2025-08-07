<template>
  <div
    v-if="isVisible"
    class="universal__overlay"
    :class="{ 'universal__overlay--closing': isClosing }"
    @click.self="handleOverlayClick"
  >
    <div
      class="universal__popup"
      :class="{ 'universal__popup--closing': isClosing }"
    >
      <div class="universal__popup-inner">
        <!-- 關閉按鈕 (僅在允許關閉時顯示) -->
        <button
          v-if="showCloseButton"
          class="universal__close-btn"
          @click="closeModal"
        >
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

        <div class="universal__content">
          <!-- 圖示區域 -->
          <div v-if="popupData.icon" class="universal__icon">
            <div :class="`universal__icon--${popupData.icon}`">
              <!-- Success 圖示 -->
              <svg
                v-if="popupData.icon === 'success'"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#52c41a"
                  stroke-width="2"
                />
                <path
                  d="m9 12 2 2 4-4"
                  stroke="#52c41a"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <!-- Error 圖示 -->
              <svg
                v-else-if="popupData.icon === 'error'"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#ff4d4f"
                  stroke-width="2"
                />
                <path
                  d="m15 9-6 6m0-6 6 6"
                  stroke="#ff4d4f"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <!-- Warning 圖示 -->
              <svg
                v-else-if="popupData.icon === 'warning'"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
                  stroke="#faad14"
                  stroke-width="2"
                />
                <path
                  d="M12 9v4m0 4h.01"
                  stroke="#faad14"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <!-- Loading 圖示 -->
              <div
                v-else-if="popupData.icon === 'loading'"
                class="universal__spinner"
              >
                <div class="spinner"></div>
              </div>
            </div>
          </div>

          <!-- 標題 -->
          <div v-if="popupData.title" class="universal__title">
            {{ popupData.title }}
          </div>

          <!-- 內容文字 -->
          <div v-if="popupData.text" class="universal__text">
            {{ popupData.text }}
          </div>

          <!-- HTML 內容 -->
          <div
            v-if="popupData.html"
            class="universal__html"
            v-html="popupData.html"
          ></div>

          <!-- 按鈕區域 -->
          <div v-if="showButtons" class="universal__buttons">
            <!-- 取消按鈕 -->
            <button
              v-if="popupData.showCancelButton"
              class="universal__btn universal__btn--cancel"
              @click="handleCancel"
            >
              {{ popupData.cancelButtonText || "取消" }}
            </button>

            <!-- 確認按鈕 -->
            <button
              v-if="popupData.showConfirmButton !== false"
              class="universal__btn universal__btn--confirm"
              @click="handleConfirm"
            >
              {{ popupData.confirmButtonText || "確定" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
  popupData: {
    type: Object,
    default: () => ({
      icon: null, // 'success', 'error', 'warning', 'loading'
      title: "",
      text: "",
      html: "",
      showConfirmButton: true,
      showCancelButton: false,
      confirmButtonText: "確定",
      cancelButtonText: "取消",
      allowOutsideClick: true,
      showCloseButton: true,
    }),
  },
});

const emit = defineEmits(["close", "confirm", "cancel"]);

const isClosing = ref(false);

// 計算屬性
const showCloseButton = computed(
  () => props.popupData.showCloseButton !== false,
);
const showButtons = computed(
  () =>
    props.popupData.showConfirmButton !== false ||
    props.popupData.showCancelButton,
);

// 方法
const closeModal = () => {
  isClosing.value = true;
  setTimeout(() => {
    isClosing.value = false;
    emit("close");
  });
};

const handleOverlayClick = () => {
  if (props.popupData.allowOutsideClick !== false) {
    closeModal();
  }
};

const handleConfirm = () => {
  emit("confirm");
  closeModal();
};

const handleCancel = () => {
  emit("cancel");
  closeModal();
};
</script>

<style lang="scss" scoped>
.universal {
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
    background: #2f75c9;
    background-image: url("/imgs/noticePopup_bg.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border: none;
    border-radius: 25px;
    min-width: 300px;
    max-width: 800px;
    width: fit-content;
    min-height: 200px;
    max-height: 500px;
    height: fit-content;
    position: relative;
    animation: modalBounceIn 0.3s ease-out;
    padding: 20px;

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
  }

  &__popup-inner {
    position: relative;
    border-radius: 20px;
    border: none;
    z-index: 0;
  }

  &__close-btn {
    position: absolute;
    top: -71px;
    right: -18px;
    width: 40px;
    height: 40px;
    border: none;
    background: #89bcef;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: white;
    z-index: 10;

    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(137, 188, 239, 0.4);
    }
  }

  &__content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #fff;
    padding: 10px 0; // 減少padding
    width: 100%;
  }

  &__icon {
    margin-bottom: 15px; // 減少間距
    flex-shrink: 0; // 防止圖標被壓縮

    &--success svg {
      filter: drop-shadow(0 0 10px rgba(82, 196, 26, 0.3));
    }

    &--error svg {
      filter: drop-shadow(0 0 10px rgba(255, 77, 79, 0.3));
    }

    &--warning svg {
      filter: drop-shadow(0 0 10px rgba(250, 173, 20, 0.3));
    }
  }

  &__title {
    font-size: 24px; // 稍微減少標題大小
    font-weight: bold;
    color: white;
    text-align: center;
    margin-bottom: 15px; // 減少間距
    line-height: 1.4;
    word-wrap: break-word; // 長文字自動換行

    @media (max-width: 480px) {
      font-size: 20px;
      margin-bottom: 12px;
    }
  }

  &__text {
    font-size: 16px; // 稍微減少文字大小
    line-height: 1.5;
    margin-bottom: 15px; // 減少間距
    color: #fff;
    white-space: pre-line;
    word-wrap: break-word; // 長文字自動換行
    max-width: 100%;

    @media (max-width: 480px) {
      font-size: 14px;
      margin-bottom: 12px;
    }
  }

  &__html {
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

  &__buttons {
    display: flex;
    gap: 12px; // 減少按鈕間距
    justify-content: center;
    margin-top: 15px; // 減少上方間距
    flex-wrap: wrap; // 小螢幕上允許換行
  }

  &__btn {
    padding: 10px 20px; // 稍微減少按鈕大小
    border: 2px solid #2f75c9;
    border-radius: 30px;
    font-size: 14px; // 稍微減少字體
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 80px; // 減少最小寬度
    background: transparent;
    color: #2f75c9;
    white-space: nowrap;
    flex-shrink: 0; // 防止按鈕被壓縮

    &--confirm {
      &:hover {
        background: #2f75c9;
        color: #fbed1d;
        border-color: #2f75c9;
      }
    }

    &--cancel {
      border-color: #8c8c8c;
      color: #8c8c8c;

      &:hover {
        background: #8c8c8c;
        color: white;
        border-color: #8c8c8c;
      }
    }

    @media (max-width: 480px) {
      padding: 8px 16px;
      font-size: 13px;
      min-width: 70px;
    }
  }

  &__spinner {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

/* Loading 動畫 */
.spinner {
  width: 32px; // 稍微減少Loading大小
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #fbed1d;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
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
