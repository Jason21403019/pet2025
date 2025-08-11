<template>
  <div class="completed-page">
    <Nav />
    <Banner />

    <!-- 問卷區塊位置改成完成頁面內容 -->
    <div class="questionnaire-container questionnaire-container--visible">
      <div class="completed-page__container">
        <!-- 修改：成功圖示改成圖片 -->
        <div class="completed-page__icon">
          <img
            src="/imgs/completed_title.png"
            alt="填寫成功"
            class="completed-page__icon-img"
          />
        </div>

        <!-- 內容 -->
        <div class="completed-page__content">
          <div class="completed-page__discount-content">
            <!-- 根據優惠券狀態動態顯示內容 -->
            <template v-if="hasDiscount">
              <p class="completed-page__message-text">
                恭喜獲得汪喵星球限定<br />$100購物金電子序號
              </p>
              <p class="completed-page__code-section">
                <span class="completed-page__code">【udndcsfans】</span><br />
                <span class="completed-page__reminder"
                  ><提醒您，請務必截圖並妥善保存以利兌換></span
                >
              </p>
            </template>
            <template v-else>
              <p class="completed-page__message-text">
                由於活動踴躍，<br />電子序號折扣金以贈送完畢，<br />但您能享有抽大獎機會。
              </p>
              <p class="completed-page__code-section">
                <span class="completed-page__code"
                  >觀看開講資訊，請前往活動辦法</span
                ><br />
                <span class="completed-page__reminder">快分享給親朋好友</span>
              </p>
            </template>
          </div>
        </div>

        <!-- 按鈕區域 -->
        <div class="completed-page__actions">
          <a href="#" @click="confirmSuccess" class="completed-page__btn">
            分享
          </a>
          <a
            href="https://udn.com/news/cate/2/7065"
            target="_blank"
            rel="noopener noreferrer"
            class="completed-page__btn"
          >
            揭開更多<br />寵物秘密
          </a>
        </div>
      </div>
    </div>

    <Prize />
    <Act_area />
    <Footer />
    <ToTop />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import Banner from "../components/Banner.vue";
import Nav from "../components/Nav.vue";
import Prize from "../components/Prize.vue";
import Act_area from "../components/Act_area.vue";
import Footer from "../components/Footer.vue";
import ToTop from "../components/ToTop.vue";

// 響應式資料
const hasDiscount = ref(true); // 預設有優惠券，避免閃爍

// 檢查優惠券狀態
async function checkDiscountStatus() {
  try {
    const response = await $fetch("/pet2025php/checkDiscountStatus.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (response.status === "success") {
      hasDiscount.value = response.has_discount;
    }
  } catch (error) {
    console.error("檢查優惠券狀態失敗:", error);
    // 如果 API 調用失敗，預設顯示有優惠券
    hasDiscount.value = true;
  }
}

// 路由守衛 - 確保只有填完問卷的用戶才能訪問此頁面
onMounted(async () => {
  // 檢查是否有問卷完成的標記
  const hasCompletedQuestionnaire = localStorage.getItem(
    "pet2025_questionnaire_completed",
  );
  if (!hasCompletedQuestionnaire) {
    // 如果沒有完成標記，重定向到首頁
    navigateTo("/");
    return;
  }

  // 檢查優惠券狀態
  await checkDiscountStatus();
});

// 確認成功按鈕處理
function confirmSuccess() {
  // 可以選擇重新載入頁面或執行其他操作
  window.location.reload();
}
</script>

<style lang="scss" scoped>
.completed-page {
  background-image: url("/imgs/body_bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center top;
}

.questionnaire-container {
  padding: 40px 12px 40px 12px;
  background: transparent;
  min-height: 0;
  transition: all 0.3s ease;
}
.completed-page {
  width: 100%;
  &__container {
    max-width: 500px;
    background-color: white;
    background-image: url("/imgs/completed_bg.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 20px;
    padding: 80px 40px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: none;
    margin: 0 auto;

    @media (max-width: 768px) {
      padding: 30px 20px;
    }
  }

  &__icon {
    margin-bottom: 20px;

    &-img {
      max-width: 35%;
      margin-right: 1rem;
      height: auto;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
    }
  }

  &__content {
    margin-bottom: 30px;
  }

  &__message-text {
    font-size: 20px;
    font-weight: bold;
    color: #0c3d6d;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }

  &__code-section {
    margin: 0;
  }

  &__code {
    font-size: 16px;
    font-weight: bold;
    color: #f46c00;
  }

  &__reminder {
    font-size: 12px;
    color: #0c3d6d;
    font-weight: normal;
  }

  &__actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      gap: 10px;
    }
  }

  &__btn {
    // 修改：完全複製Already_played_popup的按鈕樣式
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
}

#__nuxt {
  position: relative;
  z-index: 1;
}
</style>
