<template>
  <div class="reset-db">
    <!-- 開發模式切換按鈕 -->
    <button
      @click="toggleDevMode"
      class="reset-db__toggle"
      :class="{ 'reset-db__toggle--active': showDevTools }"
    >
      {{ showDevTools ? "隱藏" : "顯示" }} 開發工具
    </button>

    <!-- 開發工具面板 -->
    <div v-if="showDevTools" class="reset-db__panel">
      <h3 class="reset-db__title">資料庫重置工具</h3>

      <!-- 刪除特定用戶 -->
      <div class="reset-db__section">
        <label class="reset-db__label">刪除特定用戶:</label>
        <input
          v-model="targetEmail"
          type="email"
          placeholder="輸入要刪除的 email"
          class="reset-db__input"
        />
        <button
          @click="deleteUser"
          :disabled="!targetEmail || isLoading"
          class="reset-db__btn reset-db__btn--warning"
        >
          {{ isLoading ? "處理中..." : "刪除用戶" }}
        </button>
      </div>

      <!-- 完全重置資料庫 -->
      <div class="reset-db__section">
        <label class="reset-db__label">危險操作:</label>
        <button
          @click="showResetConfirm = true"
          :disabled="isLoading"
          class="reset-db__btn reset-db__btn--danger"
        >
          完全重置資料庫
        </button>
      </div>

      <!-- 安全密鑰輸入 -->
      <div class="reset-db__section">
        <label class="reset-db__label">安全密鑰:</label>
        <input
          v-model="securityKey"
          type="password"
          placeholder="輸入安全密鑰"
          class="reset-db__input"
        />
      </div>

      <!-- 結果顯示 -->
      <div
        v-if="result"
        class="reset-db__result"
        :class="`reset-db__result--${result.type}`"
      >
        {{ result.message }}
      </div>
    </div>

    <!-- 確認重置彈窗 -->
    <div v-if="showResetConfirm" class="reset-db__modal">
      <div class="reset-db__modal-content">
        <h4>⚠️ 危險操作確認</h4>
        <p>您即將完全清空資料庫並重置 ID，此操作無法復原！</p>
        <p>請再次確認您要執行此操作。</p>
        <div class="reset-db__modal-buttons">
          <button @click="showResetConfirm = false" class="reset-db__btn">
            取消
          </button>
          <button
            @click="resetDatabase"
            class="reset-db__btn reset-db__btn--danger"
          >
            確認重置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const showDevTools = ref(false);
const showResetConfirm = ref(false);
const targetEmail = ref("");
const securityKey = ref("pet2025reset");
const isLoading = ref(false);
const result = ref(null);

function toggleDevMode() {
  showDevTools.value = !showDevTools.value;
}

async function deleteUser() {
  if (!targetEmail.value || !securityKey.value) {
    result.value = { type: "error", message: "請輸入 email 和安全密鑰" };
    return;
  }

  isLoading.value = true;
  result.value = null;

  try {
    const response = await $fetch("/pet2025php/resetPet2025Database.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "delete_user",
        email: targetEmail.value,
        security_key: securityKey.value,
      }),
    });

    result.value = {
      type: response.status === "success" ? "success" : "warning",
      message: response.message,
    };

    if (response.status === "success") {
      targetEmail.value = "";
    }
  } catch (error) {
    result.value = { type: "error", message: "請求失敗: " + error.message };
  } finally {
    isLoading.value = false;
  }
}

async function resetDatabase() {
  if (!securityKey.value) {
    result.value = { type: "error", message: "請輸入安全密鑰" };
    return;
  }

  isLoading.value = true;
  result.value = null;
  showResetConfirm.value = false;

  try {
    const response = await $fetch("/pet2025php/resetPet2025Database.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "reset_all",
        security_key: securityKey.value,
      }),
    });

    result.value = {
      type: response.status === "success" ? "success" : "error",
      message: response.message,
    };
  } catch (error) {
    result.value = { type: "error", message: "請求失敗: " + error.message };
  } finally {
    isLoading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.reset-db {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;

  &__toggle {
    background: #ff6b6b;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;

    &--active {
      background: #51cf66;
    }
  }

  &__panel {
    position: absolute;
    top: 40px;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
    min-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &__title {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 16px;
  }

  &__section {
    margin-bottom: 16px;
  }

  &__label {
    display: block;
    margin-bottom: 4px;
    font-weight: bold;
    font-size: 12px;
    color: #555;
  }

  &__input {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 8px;
    font-size: 12px;
  }

  &__btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &--warning {
      background: #ffa726;
      color: white;
    }

    &--danger {
      background: #ff5252;
      color: white;
    }
  }

  &__result {
    padding: 8px;
    border-radius: 4px;
    font-size: 12px;
    margin-top: 8px;

    &--success {
      background: #e8f5e8;
      color: #2e7d32;
      border: 1px solid #4caf50;
    }

    &--warning {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffc107;
    }

    &--error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #dc3545;
    }
  }

  &__modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  }

  &__modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 400px;
    text-align: center;

    h4 {
      margin: 0 0 12px 0;
      color: #ff5252;
    }

    p {
      margin: 8px 0;
      font-size: 14px;
    }
  }

  &__modal-buttons {
    margin-top: 16px;
    display: flex;
    gap: 8px;
    justify-content: center;
  }
}
</style>
