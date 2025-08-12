<template>
  <div class="admin-container">
    <!-- 頁面標題 -->
    <div class="admin-header">
      <h1>寵物問卷活動後台管理</h1>
      <div class="header-actions">
        <button @click="refreshData" class="btn btn-primary">重新整理</button>
        <button @click="exportData" class="btn btn-success">匯出資料</button>
        <!-- 新增：開發工具切換按鈕 -->
        <button
          @click="toggleDevTools"
          class="btn btn-warning"
          v-if="isDevelopment && showBtn"
        >
          {{ showDevTools ? "隱藏" : "顯示" }} 開發工具
        </button>
      </div>
    </div>

    <!-- 新增：開發工具面板 -->
    <div v-if="showDevTools && isDevelopment" class="dev-tools-panel">
      <h3 class="dev-tools__title">⚠️ 開發工具 - 資料庫重置</h3>

      <!-- 刪除特定用戶 -->
      <div class="dev-tools__section">
        <label class="dev-tools__label">刪除特定用戶:</label>
        <div class="dev-tools__input-group">
          <input
            v-model="targetEmail"
            type="email"
            placeholder="輸入要刪除的 email"
            class="dev-tools__input"
          />
          <button
            @click="deleteUser"
            :disabled="!targetEmail || isLoading"
            class="btn btn-warning btn-sm"
          >
            {{ isLoading ? "處理中..." : "刪除用戶" }}
          </button>
        </div>
      </div>

      <!-- 完全重置資料庫 -->
      <div class="dev-tools__section">
        <label class="dev-tools__label">危險操作:</label>
        <div class="dev-tools__input-group">
          <button
            @click="showResetConfirm = true"
            :disabled="isLoading"
            class="btn btn-danger btn-sm"
          >
            完全重置資料庫 (清空所有資料)
          </button>
        </div>
      </div>

      <!-- 安全密鑰輸入 -->
      <div class="dev-tools__section">
        <label class="dev-tools__label">安全密鑰:</label>
        <div class="dev-tools__input-group">
          <input
            v-model="securityKey"
            type="password"
            placeholder="輸入安全密鑰"
            class="dev-tools__input"
          />
        </div>
      </div>

      <!-- 結果顯示 -->
      <div
        v-if="dbResult"
        class="dev-tools__result"
        :class="`dev-tools__result--${dbResult.type}`"
      >
        {{ dbResult.message }}
      </div>
    </div>

    <!-- 確認重置彈窗 -->
    <div
      v-if="showResetConfirm"
      class="modal-overlay"
      @click="showResetConfirm = false"
    >
      <div class="modal-content reset-confirm-modal" @click.stop>
        <div class="modal-header">
          <h3>⚠️ 危險操作確認</h3>
          <button @click="showResetConfirm = false" class="close-btn">
            &times;
          </button>
        </div>
        <div class="modal-body">
          <div class="warning-content">
            <p><strong>您即將完全清空資料庫並重置 ID！</strong></p>
            <p>此操作將會：</p>
            <ul>
              <li>刪除所有問卷記錄</li>
              <li>重置 ID 從 1 開始計算</li>
              <li>此操作無法復原</li>
            </ul>
            <p>請再次確認您要執行此操作。</p>
          </div>
          <div class="modal-buttons">
            <button @click="showResetConfirm = false" class="btn btn-secondary">
              取消
            </button>
            <button
              @click="resetDatabase"
              class="btn btn-danger"
              :disabled="isLoading"
            >
              {{ isLoading ? "重置中..." : "確認重置" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 統計面板 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-number">{{ totalUsers }}</div>
        <div class="stat-label">總參與人數</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ todayUsers }}</div>
        <div class="stat-label">今日填寫人數</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ activeUsers }}</div>
        <div class="stat-label">本週活躍用戶</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">{{ eventUsers }}</div>
        <div class="stat-label">活動期間用戶</div>
      </div>
    </div>

    <!-- 篩選控制 -->
    <div class="filter-panel">
      <div class="filter-group">
        <label>用戶ID：</label>
        <input
          type="text"
          v-model="filters.userId"
          placeholder="輸入用戶ID"
          @input="debouncedFilter"
        />
      </div>
      <div class="filter-group">
        <label>Email：</label>
        <input
          type="text"
          v-model="filters.email"
          placeholder="輸入Email"
          @input="debouncedFilter"
        />
      </div>
      <div class="filter-group">
        <label>IP地址：</label>
        <input
          type="text"
          v-model="filters.ip"
          placeholder="輸入IP地址"
          @input="debouncedFilter"
        />
      </div>
      <div class="filter-group">
        <label>每頁顯示：</label>
        <select v-model="pageSize" @change="changePageSize">
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="200">200</option>
        </select>
      </div>
    </div>

    <!-- 數據表格 -->
    <div class="data-table-container">
      <div class="table-header">
        <h2>問卷填寫記錄</h2>
        <div class="pagination-info">
          顯示 {{ (currentPage - 1) * pageSize + 1 }} -
          {{ Math.min(currentPage * pageSize, filteredRecords.length) }}
          筆，共 {{ filteredRecords.length }} 筆記錄
        </div>
      </div>

      <!-- 虛擬滾動表格 -->
      <div class="virtual-table-container" ref="tableContainer">
        <table class="data-table">
          <thead>
            <tr>
              <th @click="sortBy('id')">
                ID <i :class="getSortIcon('id')"></i>
              </th>
              <th @click="sortBy('username')">
                用戶ID <i :class="getSortIcon('username')"></i>
              </th>
              <th @click="sortBy('email')">
                Email <i :class="getSortIcon('email')"></i>
              </th>
              <th @click="sortBy('ip')">
                IP地址 <i :class="getSortIcon('ip')"></i>
              </th>
              <th @click="sortBy('created_at')">
                填寫時間 <i :class="getSortIcon('created_at')"></i>
              </th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in displayedRecords" :key="record.id">
              <td>{{ record.id }}</td>
              <td>{{ record.username }}</td>
              <td>{{ record.email }}</td>
              <td>{{ record.ip || "-" }}</td>
              <td>{{ formatDate(record.created_at) }}</td>
              <td>
                <button
                  @click="viewDetails(record)"
                  class="btn btn-sm btn-info"
                >
                  詳細
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 優化的分頁控制 -->
      <div class="pagination-controls">
        <div class="pagination-info">
          共 {{ totalPages }} 頁，{{ filteredRecords.length }} 筆記錄
        </div>
        <div class="pagination">
          <button
            @click="changePage(1)"
            :disabled="currentPage === 1"
            class="btn btn-secondary"
          >
            首頁
          </button>
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="btn btn-secondary"
          >
            上一頁
          </button>

          <!-- 頁碼輸入框 -->
          <div class="page-input-group">
            <input
              type="number"
              v-model.number="pageInput"
              @keyup.enter="goToPage"
              :min="1"
              :max="totalPages"
              class="page-input"
            />
            <span>/ {{ totalPages }}</span>
            <button @click="goToPage" class="btn btn-secondary btn-sm">
              跳轉
            </button>
          </div>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="btn btn-secondary"
          >
            下一頁
          </button>
          <button
            @click="changePage(totalPages)"
            :disabled="currentPage === totalPages"
            class="btn btn-secondary"
          >
            末頁
          </button>
        </div>
      </div>
    </div>

    <!-- 詳細資訊彈窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>用戶詳細資訊</h3>
          <button @click="closeDetailModal" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <label>用戶ID：</label>
              <span>{{ selectedRecord?.username }}</span>
            </div>
            <div class="detail-item">
              <label>Email：</label>
              <span>{{ selectedRecord?.email }}</span>
            </div>
            <div class="detail-item">
              <label>IP地址：</label>
              <span>{{ selectedRecord?.ip || "-" }}</span>
            </div>
            <div class="detail-item">
              <label>填寫時間：</label>
              <span>{{ formatDate(selectedRecord?.created_at) }}</span>
            </div>

            <!-- 問卷答案 -->
            <div class="detail-item full-width" v-if="selectedRecord">
              <label>問卷答案：</label>
              <div class="answers-grid">
                <div v-for="i in 15" :key="i" class="answer-item">
                  <strong>Q{{ i }}:</strong>
                  <span>{{ selectedRecord[`answer${i}`] || "未填寫" }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 載入中遮罩 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <p>載入中...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted } from "vue";
import Swal from "sweetalert2";

useSeoMeta({
  title: "寵物問卷活動後台管理",
  description: "寵物問卷活動後台管理系統",
});

// 基本狀態
const loading = ref(false);
const records = ref([]);
const filteredRecords = ref([]);

// 統計數據
const totalUsers = ref(0);
const todayUsers = ref(0);
const activeUsers = ref(0);
const eventUsers = ref(0);

// 優化的分頁狀態
const currentPage = ref(1);
const pageSize = ref(20);
const pageInput = ref(1);

// 排序和篩選狀態
const sortField = ref("id");
const sortDirection = ref("desc");
const filters = ref({
  userId: "",
  email: "",
  ip: "",
});

// 彈窗狀態
const showDetailModal = ref(false);
const selectedRecord = ref(null);

// 修正：開發工具相關變數 - 避免 SSR 錯誤
const isDevelopment = ref(false);
const showDevTools = ref(false);
const showBtn = ref(false); // 新增：控制按鈕顯示
const showResetConfirm = ref(false);
const targetEmail = ref("");
const securityKey = ref("pet2025reset");
const dbResult = ref(null);

// 在客戶端初始化 isDevelopment
onMounted(() => {
  // 只在客戶端執行，避免 SSR 錯誤
  if (process.client) {
    isDevelopment.value =
      process.env.NODE_ENV === "development" ||
      window.location.hostname.includes("localhost") ||
      window.location.hostname.includes("lab-event");

    // 新增：監聽鍵盤事件
    window.addEventListener("keydown", handleKeyDown);
  }

  // 載入資料
  fetchRecords();
});

// 新增：鍵盤事件處理
function handleKeyDown(e) {
  if (e.shiftKey && e.key.toLowerCase() === "d") {
    e.preventDefault();
    showBtn.value = !showBtn.value;
  }
}

// 清理事件監聽器
onUnmounted(() => {
  if (process.client) {
    window.removeEventListener("keydown", handleKeyDown);
  }
});

// 計算屬性
const totalPages = computed(() =>
  Math.ceil(filteredRecords.value.length / pageSize.value),
);

const displayedRecords = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredRecords.value.slice(start, end);
});

// 防抖函數
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

const debouncedFilter = debounce(applyFilters, 300);

// 優化的獲取記錄函數
async function fetchRecords() {
  loading.value = true;
  try {
    const response = await $fetch("/pet2025php/checkPlayStatus.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        admin_mode: true,
      }),
    });

    if (response.status === "success") {
      if (Array.isArray(response.records)) {
        records.value = response.records;
      } else {
        records.value = [response];
      }

      // 處理資料
      filteredRecords.value = [...records.value];
      applySorting();

      // 統計數據處理
      if (response.stats) {
        totalUsers.value = response.stats.totalUsers;
        todayUsers.value = response.stats.todayUsers;
        activeUsers.value = response.stats.activeUsers;
        eventUsers.value = response.stats.eventUsers;
      } else {
        updateStats();
      }
    } else {
      throw new Error(response.message || "獲取資料失敗");
    }
  } catch (error) {
    console.error("獲取記錄失敗:", error);
    Swal.fire({
      icon: "error",
      title: "獲取資料失敗",
      text: error.message,
    });
  } finally {
    loading.value = false;
  }
}

// 優化的篩選函數
function applyFilters() {
  const startTime = performance.now();

  filteredRecords.value = records.value.filter((record) => {
    if (
      filters.value.userId &&
      (!record.username ||
        !record.username
          .toLowerCase()
          .includes(filters.value.userId.toLowerCase()))
    ) {
      return false;
    }

    if (
      filters.value.email &&
      (!record.email ||
        !record.email.toLowerCase().includes(filters.value.email.toLowerCase()))
    ) {
      return false;
    }

    if (
      filters.value.ip &&
      (!record.ip ||
        !record.ip.toLowerCase().includes(filters.value.ip.toLowerCase()))
    ) {
      return false;
    }

    return true;
  });

  const endTime = performance.now();
  console.log(`篩選耗時: ${endTime - startTime}ms`);

  currentPage.value = 1;
  pageInput.value = 1;
  applySorting();
}

// 優化的排序函數
function applySorting() {
  const startTime = performance.now();

  filteredRecords.value.sort((a, b) => {
    const aVal = a[sortField.value] || "";
    const bVal = b[sortField.value] || "";

    if (sortField.value === "id") {
      const aNum = parseInt(aVal) || 0;
      const bNum = parseInt(bVal) || 0;
      return sortDirection.value === "asc" ? aNum - bNum : bNum - aNum;
    }

    if (sortField.value === "created_at") {
      const aDate = new Date(aVal);
      const bDate = new Date(bVal);
      return sortDirection.value === "asc" ? aDate - bDate : bDate - aDate;
    }

    const comparison = String(aVal).localeCompare(String(bVal));
    return sortDirection.value === "asc" ? comparison : -comparison;
  });

  const endTime = performance.now();
  console.log(`排序耗時: ${endTime - startTime}ms`);
}

// 優化的分頁函數
function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    pageInput.value = page;

    nextTick(() => {
      document.querySelector(".data-table-container").scrollIntoView({
        behavior: "smooth",
      });
    });
  }
}

function changePageSize() {
  currentPage.value = 1;
  pageInput.value = 1;
}

function goToPage() {
  if (pageInput.value >= 1 && pageInput.value <= totalPages.value) {
    changePage(pageInput.value);
  }
}

// 批量處理的匯出函數
async function exportData() {
  if (filteredRecords.value.length > 10000) {
    const result = await Swal.fire({
      title: "大量資料匯出",
      text: `即將匯出 ${filteredRecords.value.length} 筆資料，這可能需要較長時間。`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "繼續匯出",
      cancelButtonText: "取消",
    });

    if (!result.isConfirmed) return;
  }

  try {
    const progressSwal = Swal.fire({
      title: "正在匯出...",
      html: "進度: <b>0%</b>",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const batchSize = 1000;
    let csvContent = "\uFEFF"; // BOM for UTF-8

    // 標題行
    const headers = [
      "ID",
      "用戶ID",
      "Email",
      "IP地址",
      "填寫時間",
      ...Array.from({ length: 15 }, (_, i) => `問題${i + 1}`),
    ];
    csvContent += headers.join(",") + "\n";

    for (let i = 0; i < filteredRecords.value.length; i += batchSize) {
      const batch = filteredRecords.value.slice(i, i + batchSize);

      batch.forEach((record) => {
        const formatTimeForCsv = (dateString) => {
          if (!dateString) return "";
          try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleString("zh-TW", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            });
          } catch (error) {
            return dateString;
          }
        };

        const row = [
          record.id || "",
          record.username || "",
          record.email || "",
          record.ip || "",
          formatTimeForCsv(record.created_at),
          ...Array.from(
            { length: 15 },
            (_, i) => record[`answer${i + 1}`] || "",
          ),
        ];

        const processedRow = row.map((field) => {
          const fieldStr = String(field);
          if (
            fieldStr.includes(",") ||
            fieldStr.includes('"') ||
            fieldStr.includes("\n") ||
            fieldStr.includes("\r")
          ) {
            return `"${fieldStr.replace(/"/g, '""')}"`;
          }
          return fieldStr;
        });

        csvContent += processedRow.join(",") + "\n";
      });

      const progress = Math.round(
        ((i + batchSize) / filteredRecords.value.length) * 100,
      );
      Swal.update({
        html: `進度: <b>${Math.min(progress, 100)}%</b>`,
      });

      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    // 創建並下載文件
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, 19);
    link.setAttribute("download", `寵物問卷記錄_${timestamp}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    progressSwal.close();

    Swal.fire({
      icon: "success",
      title: "匯出成功",
      text: `已匯出 ${filteredRecords.value.length} 筆資料`,
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (error) {
    console.error("匯出錯誤:", error);
    Swal.fire({
      icon: "error",
      title: "匯出失敗",
      text: error.message,
    });
  }
}

// 新增：開發工具函數
function toggleDevTools() {
  showDevTools.value = !showDevTools.value;
  dbResult.value = null;
}

async function deleteUser() {
  if (!targetEmail.value || !securityKey.value) {
    dbResult.value = { type: "error", message: "請輸入 email 和安全密鑰" };
    return;
  }

  loading.value = true;
  dbResult.value = null;

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

    dbResult.value = {
      type: response.status === "success" ? "success" : "warning",
      message: response.message,
    };

    if (response.status === "success") {
      targetEmail.value = "";
      // 重新載入資料
      await fetchRecords();
    }
  } catch (error) {
    dbResult.value = { type: "error", message: "請求失敗: " + error.message };
  } finally {
    loading.value = false;
  }
}

async function resetDatabase() {
  if (!securityKey.value) {
    dbResult.value = { type: "error", message: "請輸入安全密鑰" };
    return;
  }

  loading.value = true;
  dbResult.value = null;
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

    dbResult.value = {
      type: response.status === "success" ? "success" : "error",
      message: response.message,
    };

    if (response.status === "success") {
      // 重新載入資料
      await fetchRecords();

      Swal.fire({
        icon: "success",
        title: "重置成功",
        text: "資料庫已完全重置，ID 已重新開始計算",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  } catch (error) {
    dbResult.value = { type: "error", message: "請求失敗: " + error.message };
  } finally {
    loading.value = false;
  }
}

// 監聽器
watch(pageInput, (newVal) => {
  if (newVal > totalPages.value) {
    pageInput.value = totalPages.value;
  } else if (newVal < 1) {
    pageInput.value = 1;
  }
});

// 其他現有函數
function sortBy(field) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
  applySorting();
}

function getSortIcon(field) {
  if (sortField.value !== field) return "fas fa-sort";
  return sortDirection.value === "asc" ? "fas fa-sort-up" : "fas fa-sort-down";
}

function formatDate(dateString) {
  if (!dateString) return "-";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch (error) {
    return dateString;
  }
}

function viewDetails(record) {
  selectedRecord.value = record;
  showDetailModal.value = true;
}

function closeDetailModal() {
  showDetailModal.value = false;
  selectedRecord.value = null;
}

function updateStats() {
  totalUsers.value = records.value.length;

  const today = new Date().toISOString().split("T")[0];
  todayUsers.value = records.value.filter((record) => {
    if (!record.created_at) return false;
    const recordDate = record.created_at.split(" ")[0];
    return recordDate === today;
  }).length;

  const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const lastWeekDate = lastWeek.toISOString().split("T")[0];
  activeUsers.value = records.value.filter((record) => {
    if (!record.created_at) return false;
    const recordDate = record.created_at.split(" ")[0];
    return recordDate >= lastWeekDate;
  }).length;

  eventUsers.value = records.value.length; // 活動期間用戶就是總用戶數
}

async function refreshData() {
  await fetchRecords();
  Swal.fire({
    icon: "success",
    title: "資料已更新",
    text: "最新資料已載入",
    timer: 1500,
    showConfirmButton: false,
  });
}
</script>

<style lang="scss" scoped>
@use "sass:color";

// 更新色系變數 - 呼應專案主色
$primary-blue: #2f75c9; // 專案主藍色
$light-blue: color.adjust($primary-blue, $lightness: 15%); // 淺藍色
$dark-blue: color.adjust($primary-blue, $lightness: -15%); // 深藍色
$blue-bg: color.adjust($primary-blue, $lightness: 45%); // 背景淺藍
$accent-blue: rgba(47, 117, 201, 0.1); // 半透明藍色
$accent-yellow: #fbed1d; // 專案輔助黃色
$light-yellow: color.adjust($accent-yellow, $lightness: 10%); // 淺黃色

// 新增：背景色系
$bg-cream: #fffbe1; // 主背景米黃色
$bg-cream-light: color.adjust($bg-cream, $lightness: 3%); // 更淺的米黃色
$bg-cream-dark: color.adjust($bg-cream, $lightness: -5%); // 稍深的米黃色

.admin-container {
  padding: 20px;
  margin: 0 auto;
  background: $bg-cream; // 改為米黃色背景
  min-height: 100vh;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 25px 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(47, 117, 201, 0.1);
  border-left: 5px solid $primary-blue;

  h1 {
    margin: 0;
    color: $primary-blue;
    font-size: 28px;
    font-weight: 700;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

// 按鈕樣式
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  outline: none;
  box-sizing: border-box;
  font-family: inherit;
  line-height: 1.5;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(47, 117, 201, 0.2);
  }

  &.btn-primary {
    background: linear-gradient(135deg, $primary-blue 0%, $light-blue 100%);
    color: white;
    border: 1px solid $primary-blue;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(47, 117, 201, 0.3);
      background: linear-gradient(135deg, $dark-blue 0%, $primary-blue 100%);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(47, 117, 201, 0.2);
    }
  }

  &.btn-secondary {
    background: $bg-cream-light; // 改為淺米黃色
    color: #666;
    border: 1px solid $bg-cream-dark; // 邊框用稍深的米黃色

    &:hover {
      background: $accent-blue;
      border-color: $primary-blue;
      color: $primary-blue;
    }

    &:active {
      background: color.adjust($accent-blue, $lightness: -5%);
    }
  }

  &.btn-success {
    background: linear-gradient(135deg, $primary-blue 0%, $light-blue 100%);
    color: white;
    border: 1px solid $primary-blue;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(47, 117, 201, 0.3);
      background: linear-gradient(135deg, $dark-blue 0%, $primary-blue 100%);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(47, 117, 201, 0.2);
    }
  }

  &.btn-info {
    background: linear-gradient(135deg, $light-blue 0%, $primary-blue 100%);
    color: white;
    border: 1px solid $light-blue;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(47, 117, 201, 0.3);
      background: linear-gradient(135deg, $primary-blue 0%, $dark-blue 100%);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(47, 117, 201, 0.2);
    }
  }

  &.btn-warning {
    background: linear-gradient(135deg, $accent-yellow 0%, $light-yellow 100%);
    color: #212529;
    border: 1px solid $accent-yellow;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(251, 237, 29, 0.3);
      background: linear-gradient(
        135deg,
        color.adjust($accent-yellow, $lightness: -10%) 0%,
        $accent-yellow 100%
      );
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(251, 237, 29, 0.2);
    }
  }

  &.btn-danger {
    background: linear-gradient(135deg, #dc3545 0%, #e85d75 100%);
    color: white;
    border: 1px solid #dc3545;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
      background: linear-gradient(135deg, #c82333 0%, #dc3545 100%);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);
    }
  }

  &.btn-sm {
    padding: 6px 12px;
    font-size: 12px;
    border-radius: 6px;
  }

  &.btn-lg {
    padding: 12px 24px;
    font-size: 16px;
    border-radius: 10px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 30px;

  .stat-card {
    background: white;
    padding: 25px;
    border-radius: 15px;
    text-align: center;
    box-shadow: 0 4px 15px rgba(47, 117, 201, 0.1);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    border-top: 4px solid $primary-blue;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(47, 117, 201, 0.15);
    }

    .stat-number {
      font-size: 36px;
      font-weight: 700;
      color: $primary-blue;
      margin-bottom: 8px;
    }

    .stat-label {
      color: #666;
      font-size: 14px;
      font-weight: 500;
    }
  }
}

.filter-panel {
  background: white;
  padding: 25px;
  border-radius: 15px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(47, 117, 201, 0.1);
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
  align-items: end;

  .filter-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    label {
      font-weight: 600;
      color: $primary-blue;
      font-size: 14px;
    }

    input,
    select {
      padding: 10px 15px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s ease;
      background: $bg-cream-light; // 輸入框背景用淺米黃色

      &:focus {
        outline: none;
        border-color: $primary-blue;
        box-shadow: 0 0 0 3px rgba(47, 117, 201, 0.1);
        background: white; // focus 時改為白色
      }
    }
  }
}

.data-table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 12px 8px;
    text-align: left;
    border-bottom: 1px solid #f0f0f0;
    word-wrap: break-word;
    overflow: hidden;
  }

  th {
    background: $bg-cream-light; // 表格標題用淺米黃色
    font-weight: 600;
    color: $primary-blue;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.3s ease;

    &:hover {
      background: $bg-cream-dark; // hover 時用稍深的米黃色
    }

    i {
      margin-left: 8px;
      opacity: 0.7;
      color: $primary-blue;
    }
  }

  tr:nth-child(even) {
    background: $bg-cream-light; // 偶數行用淺米黃色
  }

  tr:hover {
    background: $accent-blue;
  }

  table-layout: fixed;

  th:nth-child(1) {
    width: 60px;
  } // ID
  th:nth-child(2) {
    width: 180px;
  } // 用戶ID
  th:nth-child(3) {
    width: 220px;
  } // Email
  th:nth-child(4) {
    width: 130px;
  } // IP
  th:nth-child(5) {
    width: 160px;
  } // 填寫時間
  th:nth-child(6) {
    width: 80px;
  } // 操作
}

.data-table {
  td {
    &:nth-child(2),
    &:nth-child(3) {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      &:hover {
        white-space: normal;
        word-break: break-all;
        overflow: visible;
        position: relative;
        z-index: 10;
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        padding: 12px;
        max-width: 300px;
      }
    }
  }
}

.data-table-container {
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(47, 117, 201, 0.1);
  overflow: hidden;

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px;
    background: linear-gradient(135deg, $primary-blue 0%, $light-blue 100%);
    color: white;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }

    .pagination-info {
      font-size: 14px;
      opacity: 0.9;
    }
  }
}

.virtual-table-container {
  max-height: 600px;
  overflow-y: auto;
  overflow-x: auto;
  position: relative;
}

.pagination-controls {
  padding: 20px;
  background: $bg-cream-light; // 分頁控制用淺米黃色
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;

  .pagination-info {
    color: #6c757d;
    font-size: 14px;
  }

  .pagination {
    display: flex;
    align-items: center;
    gap: 10px;

    .page-input-group {
      display: flex;
      align-items: center;
      gap: 5px;

      .page-input {
        width: 60px;
        padding: 5px 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        text-align: center;
        background: white;

        &:focus {
          border-color: $primary-blue;
          outline: none;
          box-shadow: 0 0 0 2px rgba(47, 117, 201, 0.1);
        }
      }

      span {
        color: #6c757d;
        font-size: 14px;
      }
    }
  }
}

// 彈窗樣式
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(47, 117, 201, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(47, 117, 201, 0.3);

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px;
    background: linear-gradient(135deg, $primary-blue 0%, $light-blue 100%);
    color: white;
    border-radius: 15px 15px 0 0;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: white;
      transition: opacity 0.3s ease;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;

      &:hover {
        opacity: 0.7;
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }

  .modal-body {
    padding: 25px;
  }
}

.detail-grid {
  display: grid;
  gap: 20px;

  .detail-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: $bg-cream-light; // 詳細資訊背景用淺米黃色
    border-radius: 8px;
    border-left: 4px solid $primary-blue;

    label {
      font-weight: 600;
      color: $primary-blue;
      min-width: 140px;
    }

    span {
      color: #555;
      font-weight: 500;
    }

    &.full-width {
      grid-column: 1 / -1;

      .answers-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 10px;
        margin-top: 10px;

        .answer-item {
          background: white;
          padding: 8px 12px;
          border-radius: 6px;
          border: 1px solid #e0e0e0;
          font-size: 13px;

          strong {
            color: $primary-blue;
            margin-right: 8px;
          }
        }
      }
    }
  }
}

// 載入動畫
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 251, 225, 0.9); // 載入遮罩用半透明米黃色
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  backdrop-filter: blur(4px);

  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid $bg-cream-dark; // 載入動畫邊框用深米黃色
    border-top: 4px solid $primary-blue;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  p {
    margin-top: 15px;
    color: $primary-blue;
    font-weight: 600;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// 響應式設計
@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .filter-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .data-table {
    font-size: 11px;
    min-width: 800px;

    th,
    td {
      padding: 8px 4px;
    }

    th:nth-child(1) {
      width: 50px;
    }
    th:nth-child(2) {
      width: 160px;
    }
    th:nth-child(3) {
      width: 200px;
    }
    th:nth-child(4) {
      width: 120px;
    }
    th:nth-child(5) {
      width: 130px;
    }
    th:nth-child(6) {
      width: 70px;
    }
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .pagination-controls {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .virtual-table-container {
    max-height: 400px;
  }

  .dev-tools__input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .dev-tools__input {
    min-width: auto;
  }

  .admin-header {
    .header-actions {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
}

@media (max-width: 1200px) {
  .data-table {
    th,
    td {
      font-size: 13px;
    }
  }
}

@media (min-width: 1400px) {
  .data-table {
    th:nth-child(1) {
      width: 80px;
    }
    th:nth-child(2) {
      width: 200px;
    }
    th:nth-child(3) {
      width: 250px;
    }
    th:nth-child(4) {
      width: 140px;
    }
    th:nth-child(5) {
      width: 180px;
    }
    th:nth-child(6) {
      width: 90px;
    }
  }
}

// 新增：開發工具樣式 - 調整背景色
.dev-tools-panel {
  background: $bg-cream-light; // 開發工具面板用淺米黃色
  border: 2px solid #ffc107;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 25px;
  box-shadow: 0 4px 15px rgba(255, 193, 7, 0.2);

  .dev-tools__title {
    margin: 0 0 20px 0;
    color: #856404;
    font-size: 18px;
    font-weight: 700;
    text-align: center;
  }

  .dev-tools__section {
    margin-bottom: 15px;
    padding: 15px;
    background: white;
    border-radius: 8px;
    border-left: 4px solid #ffc107;
  }

  .dev-tools__label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #856404;
    font-size: 14px;
  }

  .dev-tools__input-group {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
  }

  .dev-tools__input {
    flex: 1;
    min-width: 200px;
    padding: 8px 12px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.3s ease;
    background: $bg-cream-light; // 輸入框用淺米黃色

    &:focus {
      outline: none;
      border-color: #ffc107;
      box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.1);
      background: white; // focus 時改為白色
    }
  }

  .dev-tools__result {
    padding: 12px;
    border-radius: 6px;
    font-size: 14px;
    margin-top: 15px;
    font-weight: 500;

    &--success {
      background: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    &--warning {
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeaa7;
    }

    &--error {
      background: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  }
}

// 重置確認彈窗樣式
.reset-confirm-modal {
  max-width: 450px;

  .warning-content {
    margin-bottom: 20px;

    p {
      margin: 10px 0;
      line-height: 1.5;
    }

    ul {
      margin: 15px 0;
      padding-left: 20px;

      li {
        margin: 5px 0;
        color: #dc3545;
      }
    }

    strong {
      color: #dc3545;
    }
  }

  .modal-buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
