<template>
  <div class="banner">
    <div class="banner__content">
      <button class="banner__trigger-area" @click="click">
        <img
          :src="isLoggedIn ? './imgs/goquz_btn.png' : './imgs/login_btn.png'"
          :alt="isLoggedIn ? '前往填問卷' : '登入立即填問卷'"
          class="banner__button-image"
        />
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
  // border: 1px solid red;
  background-image: url("/imgs/banner_bg.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center 0;
  width: 100%;
  aspect-ratio: 16 / 8;
  padding-top: 80px;
  position: relative;

  @media (max-width: 1513px) {
    // background-position: center -40px;
  }
  @media (max-width: 992px) {
    // background-position: center -20px;
  }

  @media (max-width: 768px) {
    padding-top: 70px;
  }

  @media (max-width: 480px) {
    padding-top: 65px;
  }

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
    right: 40%;
    top: 52%;
    width: 30%;
    max-width: 330px;
    cursor: pointer;
    border: none;
    background: transparent;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.05);
    }

    @media (max-width: 1800px) {
      right: 40%;
      top: 51.8%;
      width: 28%;
      max-width: 320px;
    }

    @media (max-width: 1700px) {
      right: 40%;
      top: 51.6%;
      width: 26%;
      max-width: 310px;
    }

    @media (max-width: 1600px) {
      right: 40.6%;
      top: 50.4%;
      width: 17%;
      max-width: 300px;
    }

    @media (max-width: 1500px) {
      right: 40.8%;
      top: 54.1%;
      width: 17%;
      max-width: 290px;
    }

    @media (max-width: 1400px) {
      right: 40.5%;
      top: 54%;
      width: 17%;
      max-width: 280px;
    }

    @media (max-width: 1300px) {
      right: 41%;
      top: 52.8%;
      width: 17%;
      max-width: 270px;
    }

    @media (max-width: 1200px) {
      right: 40.5%;
      top: 52.8%;
      width: 17%;
      max-width: 260px;
    }

    @media (max-width: 1100px) {
      right: 40.5%;
      top: 51.9%;
      width: 17%;
      max-width: 250px;
    }

    @media (max-width: 1000px) {
      right: 40.5%;
      top: 50.2%;
      width: 17%;
      max-width: 240px;
    }

    @media (max-width: 992px) {
      right: 41%;
      top: 55%;
      width: 17%;
      max-width: 230px;
    }

    @media (max-width: 800px) {
      right: 40.6%;
      top: 54.8%;
      width: 17%;
      max-width: 220px;
    }

    @media (max-width: 768px) {
      right: 42%;
      top: 49.5%;
      width: 17%;
      max-width: 200px;
    }
  }

  &__button-image {
    width: 100%;
    height: auto;
    object-fit: contain;
    transition: all 0.3s ease;

    .banner__trigger-area:hover & {
      transform: scale(1.02);
    }
  }
}

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
