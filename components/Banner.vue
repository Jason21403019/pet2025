<template>
  <div class="banner">
    <div class="banner__content">
      <button class="banner__trigger-area" @click="click">
        <img
          v-if="!isMobile"
          :src="isLoggedIn ? './imgs/goquez.png' : './imgs/login.png'"
          :alt="isLoggedIn ? '前往填問卷' : '登入立即填問卷'"
          class="banner__button-image banner__button-image--desktop"
        />
        <img
          v-if="isMobile"
          :src="isLoggedIn ? './imgs/goquez_m.png' : './imgs/login_m.png'"
          :alt="isLoggedIn ? '前往填問卷' : '登入立即填問卷'"
          class="banner__button-image banner__button-image--mobile"
        />
      </button>
    </div>

    <!-- 登入確認彈窗 -->
    <div
      v-if="showModal"
      class="modal-overlay"
      :class="{ closing: isClosing }"
      @click="close"
    >
      <div class="modal-content" :class="{ closing: isClosing }" @click.stop>
        <!-- 關閉按鈕 -->
        <button class="modal-close-btn" @click="close">
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
        <div class="modal-content-group">
          <div class="modal-text">
            <p>請先登入會員再填問卷</p>
            <p>才能獲得專屬折扣代碼喔</p>
            <p>你現在即將前往會員中心。</p>
            <p>成功登入後，即可填寫問卷。</p>
          </div>
          <div class="modal-buttons">
            <a
              :href="loginUrl"
              target="_blank"
              rel="noopener noreferrer"
              @click="confirm"
              class="confirm-btn"
            >
              確認
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onBeforeUnmount } from "vue";

const showModal = ref(false);
const isClosing = ref(false);
const isMobile = ref(false);
const isLoggedIn = inject("isLoggedIn", ref(false));
const loginUrl = inject("loginUrl", ref("#"));
const startQuestionnaire = inject("startQuestionnaire", () => {});
const goQues = inject("goQues", () => {});

function checkMobile() {
  isMobile.value = window.innerWidth <= 460;
}

async function click() {
  if (!isLoggedIn.value) {
    showModal.value = true;
    isClosing.value = false;
  } else {
    await goQues();
  }
}

function close() {
  isClosing.value = true;
  setTimeout(() => {
    isClosing.value = false;
    showModal.value = false;
  });
}

async function confirm() {
  await startQuestionnaire();
  close();
}

onMounted(() => {
  checkMobile();
  window.addEventListener("resize", checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", checkMobile);
});
</script>

<style lang="scss">
.banner {
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  &__content {
    max-width: 1365px;
    width: 100%;
    aspect-ratio: 1365 / 830;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    // 在992px以下增加高度，避免上下被切掉
    @media (max-width: 992px) {
      aspect-ratio: 1365 / 1190; // 增加高度比例
    }

    @media (max-width: 768px) {
      aspect-ratio: 1365 / 1190; // 再增加高度
    }

    @media (max-width: 460px) {
      aspect-ratio: 710 / 1740; // 修改：手機版使用710:800比例
    }
  }

  &__trigger-area {
    cursor: pointer;
    border: none;
    background: transparent;
    padding: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__button-image {
    width: 100%;
    height: 100%;
    transition: all 0.3s ease;

    // 大螢幕使用contain
    object-fit: contain;

    // 992px以下使用cover並增加容器高度
    @media (max-width: 992px) {
      object-fit: cover;
    }

    // 手機版換圖後恢復contain
    @media (max-width: 460px) {
      object-fit: contain;
    }
  }
}

// 修改彈窗樣式
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(168, 168, 168, 0.2);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: overlayFadeIn 0.3s ease-out;

  &.closing {
    animation: overlayFadeOut 0.3s ease-out;
  }
}

.modal-content {
  background-image: url("/imgs/loginPop.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
  max-width: 458px;
  width: 90%;
  height: 646px;
  max-height: 90vh;
  text-align: center;
  box-shadow: none;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  animation: modalBounceIn 0.3s ease-out;

  &.closing {
    animation: modalBounceOut 0.25s ease-in;
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

.modal-content-group {
  position: absolute;
  top: 60%;
  left: 33%;
  transform: translate(-20%, -50%);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.modal-close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  border: 2px solid white;
  background: #f2ee72;
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
    box-shadow: 0 4px 12px rgba(242, 238, 114, 0.4);
  }
}

.modal-text {
  margin-bottom: 0;

  p {
    margin: 2px 0;
    line-height: 1.4;
    color: #2f75c9;
    text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);

    font-size: 16px;
    font-weight: normal;

    &:first-child,
    &:nth-child(2) {
      font-size: 24px;
      font-weight: bold;
    }
  }
}

.modal-buttons {
  display: flex;
  justify-content: center;
}

.confirm-btn {
  padding: 12px 6px;
  border: 2px solid #2f75c9;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 100px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: #2f75c9;
  white-space: nowrap;

  &:hover {
    background: #2f75c9;
    color: #fbed1d;
    border-color: #2f75c9;
  }

  &:active {
    transform: translateY(-1px);
  }
}

// 響應式調整
@media (max-width: 768px) {
  .modal-content {
    max-width: 350px;
    height: 494px;
    max-height: 85vh;
  }

  .modal-content-group {
    gap: 15px;
  }

  .modal-text {
    p {
      font-size: 16px;

      &:first-child,
      &:nth-child(2) {
        font-size: 18px;
      }
    }
  }
}

@media (max-width: 480px) {
  .modal-content {
    max-width: 275px;
    height: 388px;
    max-height: 80vh;
  }

  .modal-content-group {
    gap: 12px;
  }

  .modal-text {
    p {
      font-size: 14px;

      &:first-child,
      &:nth-child(2) {
        font-size: 16px;
      }
    }
  }

  .confirm-btn {
    padding: 10px 20px;
    font-size: 14px;
  }

  .modal-close-btn {
    top: 10px;
    right: 10px;
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 360px) {
  .modal-content {
    max-width: 229px;
    height: 323px;
    max-height: 75vh;
  }
}
</style>
