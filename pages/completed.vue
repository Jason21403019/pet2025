<template>
  <div class="completed-page">
    <div class="completed-page__container">
      <!-- 成功圖示 -->
      <div class="completed-page__icon">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#52c41a"
            stroke-width="2"
            fill="#52c41a"
          />
          <path
            d="m9 12 2 2 4-4"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <!-- 標題 -->
      <h2 class="completed-page__title">填寫成功</h2>

      <!-- 內容 - 暫時顯示序號內容，等API建立後再改為動態 -->
      <div class="completed-page__content">
        <div class="completed-page__discount-content">
          <p class="completed-page__message-text">
            恭喜獲得汪喵星球限定<br />
            <span class="completed-page__discount-code">$100購物金電子序號</span
            ><br />
            <span class="completed-page__code">【udndcsfans】</span>
          </p>
          <p class="completed-page__reminder">
            <提醒您，請務必截圖並妥善保存以利兌換>
          </p>
        </div>
      </div>

      <!-- 按鈕區域 -->
      <div class="completed-page__actions">
        <button
          @click="confirmSuccess"
          class="completed-page__btn completed-page__btn--primary"
        >
          確認
        </button>
        <a
          href="https://udn.com/news/index"
          target="_blank"
          class="completed-page__btn completed-page__btn--secondary"
        >
          揭開更多寵物秘密
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

// 路由守衛 - 確保只有填完問卷的用戶才能訪問此頁面
onMounted(() => {
  // 檢查是否有問卷完成的標記
  const hasCompletedQuestionnaire = localStorage.getItem(
    "pet2025_questionnaire_completed",
  );

  if (!hasCompletedQuestionnaire) {
    // 如果沒有完成標記，重定向到首頁
    navigateTo("/");
    return;
  }

  // 暫時註解掉 API 調用，等 PHP 建立後再啟用
  // await checkDiscountCodeAvailability();
});

// 確認成功按鈕處理
function confirmSuccess() {
  // 可以選擇重新載入頁面或執行其他操作
  window.location.reload();
}
</script>

<style lang="scss" scoped>
.completed-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #ffd89b 0%, #f4c4a5 100%);

  &__container {
    max-width: 500px;
    width: 100%;
    background: white;
    border-radius: 20px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    border: 2px solid #52c41a;

    @media (max-width: 768px) {
      padding: 30px 20px;
    }
  }

  &__icon {
    margin-bottom: 20px;

    svg {
      filter: drop-shadow(0 4px 8px rgba(82, 196, 26, 0.3));
    }
  }

  &__title {
    font-size: 28px;
    color: #333;
    margin-bottom: 20px;
    font-weight: bold;

    @media (max-width: 768px) {
      font-size: 24px;
    }
  }

  &__content {
    margin-bottom: 30px;
  }

  &__message-text {
    font-size: 18px;
    color: #333;
    line-height: 1.6;
    margin-bottom: 15px;

    @media (max-width: 768px) {
      font-size: 16px;
    }
  }

  &__discount-code {
    font-size: 20px;
    font-weight: bold;
    color: #52c41a;
    display: block;
    margin: 10px 0;
  }

  &__code {
    font-size: 16px;
    font-weight: bold;
    color: #1890ff;
    background: #f0f8ff;
    padding: 5px 10px;
    border-radius: 8px;
    display: inline-block;
    margin: 10px 0;
    border: 1px solid #d6e4ff;
  }

  &__reminder {
    font-size: 14px;
    color: #ff4d4f;
    font-weight: 500;
    margin-top: 15px;
    padding: 10px;
    background: #fff2f0;
    border-radius: 8px;
    border: 1px solid #ffccc7;
  }

  &__actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
    }
  }

  &__btn {
    padding: 12px 24px;
    border: none;
    border-radius: 25px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;

    @media (max-width: 768px) {
      width: 100%;
      max-width: 200px;
    }

    &--primary {
      background: linear-gradient(135deg, #52c41a, #73d13d);
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(82, 196, 26, 0.4);
      }
    }

    &--secondary {
      background: linear-gradient(135deg, #1890ff, #40a9ff);
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
      }
    }
  }
}
</style>
