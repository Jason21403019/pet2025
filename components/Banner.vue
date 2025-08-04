<template>
  <div class="banner">
    <div class="banner__content">
      <button class="banner__trigger-area" @click="click">
        {{ isLoggedIn ? "前往填問卷" : "登入立即填問卷" }}
      </button>
    </div>

    <!-- 登入確認彈窗 -->
    <div v-if="showModal" class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <div class="modal-text">
          <p>請先登入會員再填問卷</p>
          <p>才能獲得專屬折扣代碼喔</p>
          <br />
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
</template>

<script setup>
import { ref, inject } from "vue";

const showModal = ref(false);

// 使用注入的狀態和方法
const isLoggedIn = inject("isLoggedIn", ref(false));
const loginUrl = inject("loginUrl", ref("#"));
const startQuestionnaire = inject("startQuestionnaire", () => {});
const goQues = inject("goQues", () => {});

async function click() {
  if (!isLoggedIn.value) {
    showModal.value = true;
  } else {
    await goQues();
  }
}

function close() {
  showModal.value = false;
}

async function confirm() {
  await startQuestionnaire();
  close();
}
</script>

<style lang="scss">
.banner {
  width: 100%;
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;

  &__content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }

  &__trigger-area {
    position: absolute;
    right: 18.4%;
    top: 37.8%;
    width: 30%;
    max-width: 250px;
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    cursor: pointer;
    border: 2px solid rgb(255, 255, 255);
    background: rgba(0, 0, 0, 0.3);
    color: white;
    font-weight: bold;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(0, 0, 0, 0.5);
      transform: scale(1.05);
    }

    @media (max-width: 1535px) {
      right: 17.7%;
      top: 36%;
      width: 15%;
      min-width: 80px;
      font-size: 14px;
    }

    @media (max-width: 768px) {
      top: 56.6%;
      right: 35.4%;
      width: 28%;
      min-width: 60px;
      font-size: 12px;
    }
  }
}

// 彈窗樣式
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 30px;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-text {
  margin-bottom: 25px;

  p {
    margin: 5px 0;
    font-size: 16px;
    line-height: 1.5;
    color: #333;
  }
}

.modal-buttons {
  display: flex;
  justify-content: center;
}

.confirm-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #007bff;
  color: white;

  &:hover {
    background: #0056b3;
  }
}
</style>
