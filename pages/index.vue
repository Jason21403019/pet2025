<template>
  <Banner
    @startDivination="startQuestionnaire"
    :loginUrl="loginUrl"
    :isLoggedIn="isLoggedIn"
  />
  <div class="questionnaire-container">
    <!-- 加載中彈窗 -->
    <Loading_popup
      :is-visible="showLoadingPopup"
      :loading-data="loadingData"
      @close="closeLoadingPopup"
    />
    <!-- 驗證彈窗 -->
    <Verification_popup
      :is-visible="showVerificationPopup"
      @close="closeVerificationPopup"
      @opened="onVerificationPopupOpened"
    />
    <!-- 通用彈窗 -->
    <Universal_popup
      :is-visible="showUniversalPopup"
      :popup-data="universalPopupData"
      @close="closeUniversalPopup"
      @confirm="handleUniversalConfirm"
      @cancel="handleUniversalCancel"
    />

    <!-- 問卷組件 -->
    <Questionnaire
      v-if="showQuestionnaire"
      @questionnaire-completed="onSubmit"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import axios from "axios";
import Banner from "../components/Banner.vue";
import Loading_popup from "../components/Loading_popup.vue";
import Verification_popup from "../components/Verification_popup.vue";
import Universal_popup from "../components/Universal_popup.vue";
import Questionnaire from "../components/Questionnaire.vue";

// ==================== 基本狀態管理 ====================
const config = useRuntimeConfig();
const showDebugTools = ref(false);
const turnstileToken = ref(null);
const turnstileWidgetId = ref(null);
const isTurnstileVerified = ref(false);
const isLoggedIn = ref(false);
const showQuestionnaire = ref(false);

// 彈窗相關
const showLoadingPopup = ref(false);
const loadingData = ref({});
const showVerificationPopup = ref(false);
const showUniversalPopup = ref(false);
const universalPopupData = ref({});
// 添加問卷配置狀態
const questionnaireConfig = ref(null);

// 開發環境測試函數
if (process.dev) {
  onMounted(() => {
    window.showLoadingPopup = showLoadingPopup;
    window.closeLoadingPopup = closeLoadingPopup;
    window.showUniversalPopup = showUniversalPopup;
    window.closeUniversalPopup = closeUniversalPopup;
    window.showUniversalDialog = showUniversalDialog;

    // 測試函數
    window.testApiError = () => {
      showUniversalDialog({
        icon: "error",
        title: "提交失敗",
        text: "測試：伺服器錯誤，請稍後再試",
        confirmButtonText: "確定",
        showCancelButton: true,
        cancelButtonText: "重新嘗試",
      });
    };

    window.testRobotFail = () => {
      showUniversalDialog({
        icon: "warning",
        title: "機器人驗證失敗",
        text: "請重新進行驗證",
        confirmButtonText: "重新驗證",
        showCancelButton: false,
      });
    };

    window.testAutomationDetection = () => {
      showUniversalDialog({
        icon: "error",
        title: "安全警告",
        text: "系統檢測到自動化行為，請勿使用機器人或腳本，請使用正常瀏覽器操作。",
        confirmButtonText: "重新驗證",
        showCancelButton: false,
      });
    };

    window.testSystemError = () => {
      showUniversalDialog({
        icon: "error",
        title: "系統錯誤",
        text: "啟動問卷流程時發生錯誤，請稍後再試",
      });
    };

    window.testSecurityFail = () => {
      showUniversalDialog({
        icon: "warning",
        title: "安全驗證失敗",
        text: "驗證已過期，需要重新開始流程",
        confirmButtonText: "重新開始",
        showCancelButton: false,
      });
    };

    window.showVerificationPopup = showVerificationPopup;
  });
}

// 創建統一的彈窗顯示函數
function showUniversalDialog(options) {
  universalPopupData.value = {
    icon: options.icon || null,
    title: options.title || "",
    text: options.text || "",
    html: options.html || "",
    showConfirmButton: options.showConfirmButton !== false,
    showCancelButton: options.showCancelButton || false,
    confirmButtonText: options.confirmButtonText || "確定",
    cancelButtonText: options.cancelButtonText || "取消",
    allowOutsideClick: options.allowOutsideClick !== false,
    showCloseButton: options.showCloseButton !== false,
  };

  showUniversalPopup.value = true;

  return new Promise((resolve) => {
    const handleClose = (result) => {
      showUniversalPopup.value = false;
      resolve(result);
    };
    window._universalPopupResolve = handleClose;
  });
}

// 關閉彈窗的函數
const closeUniversalPopup = () => {
  showUniversalPopup.value = false;
};

const handleUniversalConfirm = () => {
  if (window._universalPopupResolve) {
    window._universalPopupResolve({ isConfirmed: true });
  }
};

const handleUniversalCancel = () => {
  if (window._universalPopupResolve) {
    window._universalPopupResolve({ isDismissed: true, dismiss: "cancel" });
  }
};

// 判斷是否為開發環境
const isDevelopment = computed(() => {
  return import.meta.env?.DEV || false;
});

// Cloudflare Turnstile 配置
const TURNSTILE_SITE_KEY = config.public.turnstileSiteKey;

// ==================== API URL 管理 ====================
function getApiUrl(endpoint) {
  const baseUrl = (() => {
    if (config.public.domain?.includes("lab-event")) {
      return "https://lab-event.udn.com/bd_pet2025/pet2025php";
    } else if (config.public.domain?.includes("event.udn")) {
      return "https://event.udn.com/bd_fate2025/pet2025php";
    } else {
      return "https://lab-event.udn.com/bd_pet2025/pet2025php";
    }
  })();

  return `${baseUrl}/${endpoint}`;
}

// 使用固定的登入 URL
const loginUrl = computed(() => {
  if (typeof window === "undefined") return "#";

  const hostname = window.location.hostname;
  const allowedHosts = ["lab-event.udn.com", "event.udn.com", "localhost"];

  let redirectUrl;
  if (hostname === "lab-event.udn.com") {
    redirectUrl = "https://lab-event.udn.com/bd_pet2025/";
  } else if (hostname === "event.udn.com") {
    redirectUrl = "https://event.udn.com/bd_fate2025/";
  } else if (
    allowedHosts.includes(hostname) ||
    hostname.startsWith("localhost")
  ) {
    redirectUrl = "https://lab-event.udn.com/bd_pet2025/";
  } else {
    redirectUrl = "https://lab-event.udn.com/bd_pet2025/";
  }

  return `https://member.udn.com/member/login.jsp?site=bd_fate2025&again=y&redirect=${redirectUrl}`;
});

// ==================== Cookie 與本地存儲管理 ====================
function getCookieValue(name) {
  if (typeof document === "undefined") return null;
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    let parts = cookie.trim().split("=");
    if (parts[0].trim() === name) {
      return parts.slice(1).join("=");
    }
  }
  return null;
}

// 更新登入狀態
function updateLoginStatus() {
  const udnmember = getCookieValue("udnmember");
  const um2 = getCookieValue("um2");
  isLoggedIn.value = !!(udnmember && um2);
}

// ==================== Turnstile 機器人驗證 ====================
function loadTurnstileScript() {
  if (typeof window === "undefined") return;

  if (!document.getElementById("cf-turnstile-script")) {
    const script = document.createElement("script");
    script.id = "cf-turnstile-script";
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setTimeout(renderTurnstile, 100);
    };
    document.head.appendChild(script);
  } else {
    setTimeout(renderTurnstile, 100);
  }
}

function renderTurnstile() {
  if (typeof window === "undefined" || !window.turnstile) return;

  const container = document.getElementById("turnstile-container");
  if (!container) return;

  if (turnstileWidgetId.value) {
    try {
      window.turnstile.remove(turnstileWidgetId.value);
    } catch (e) {
      console.error("Turnstile 移除錯誤:", e);
    }
  }

  try {
    turnstileWidgetId.value = window.turnstile.render("#turnstile-container", {
      sitekey: TURNSTILE_SITE_KEY,
      theme: "dark",
      callback: function (token) {
        console.log("Turnstile 驗證成功");

        turnstileToken.value = token;
        isTurnstileVerified.value = true;
        localStorage.setItem("temp_turnstile_token", token);

        setVerificationSuccess();
        closeVerificationPopup();
        proceedToSubmitQuestionnaire();
      },
      "expired-callback": function () {
        console.warn("Turnstile token 已過期");
        turnstileToken.value = null;
        isTurnstileVerified.value = false;
        localStorage.removeItem("temp_turnstile_token");
      },
    });
  } catch (error) {
    console.error("Turnstile 渲染錯誤:", error);
  }
}

function setVerificationSuccess() {
  if (typeof window === "undefined") return;
  isTurnstileVerified.value = true;
}

// ==================== 安全令牌管理模組 ====================
const securityManager = {
  flow: {
    async generate() {
      try {
        const apiUrl = getApiUrl("auth_token.php");
        console.log("正在獲取流程安全令牌...");

        const response = await axios.get(apiUrl, {
          withCredentials: true,
          headers: { "X-Requested-With": "XMLHttpRequest" },
        });

        if (response.data.status !== "success") {
          throw new Error("無法生成流程令牌");
        }

        const token = response.data.token;
        localStorage.setItem("pet2025_flow_token", token);
        const expiryTime = Date.now() + 5 * 60 * 1000;
        localStorage.setItem("pet2025_flow_token_expiry", String(expiryTime));

        console.log("流程令牌獲取成功");
        return token;
      } catch (error) {
        console.error("生成流程令牌錯誤:", error);
        throw error;
      }
    },

    get() {
      const token = localStorage.getItem("pet2025_flow_token");
      const expiryTime = parseInt(
        localStorage.getItem("pet2025_flow_token_expiry") || "0",
      );

      const graceTime = 2 * 60 * 1000;

      if (expiryTime + graceTime < Date.now()) {
        console.warn("流程令牌已過期");
        this.clear();
        return null;
      }

      return token;
    },

    clear() {
      localStorage.removeItem("pet2025_flow_token");
      localStorage.removeItem("pet2025_flow_token_expiry");
    },
  },

  clearAll() {
    this.flow.clear();
  },
};

// ==================== 問卷相關功能 ====================
// 檢查用戶是否已經填寫過問卷
async function hasSubmittedQuestionnaire() {
  if (typeof window === "undefined") return false;

  const udnmember = getCookieValue("udnmember") || "";
  const um2 = getCookieValue("um2") || "";

  if (!udnmember || !um2) {
    console.log("用戶未登入，無法檢查問卷狀態");
    return false;
  }

  try {
    const apiUrl = getApiUrl("checkPlayStatus.php");
    console.log("從資料庫檢查問卷狀態...");

    const requestData = { udnmember, um2 };

    const response = await axios.post(apiUrl, requestData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    console.log("問卷狀態檢查回應:", response.data);

    // 修改檢查邏輯，對應後端的 completed 欄位
    if (
      response.data.status === "success" &&
      response.data.completed === true
    ) {
      console.log("資料庫確認：用戶已填寫過問卷");

      // 先關閉loading彈窗，再顯示已填寫過的彈窗
      closeLoadingPopup();
      await showAlreadySubmittedDialog(response.data);
      return true;
    }

    console.log("資料庫確認：用戶尚未填寫問卷");
    return false;
  } catch (error) {
    console.error("檢查問卷狀態時發生錯誤:", error);

    // 如果是活動時間相關的錯誤，顯示對應訊息
    if (error.response && error.response.data) {
      const errorData = error.response.data;
      if (errorData.message) {
        closeLoadingPopup(); // 先關閉loading彈窗
        await showUniversalDialog({
          icon: "warning",
          title: "活動提醒",
          text: errorData.message,
          confirmButtonText: "確定",
          showCancelButton: false,
        });
      }
    }

    return false;
  }
}

// 顯示已填寫過問卷的彈窗
async function showAlreadySubmittedDialog(data) {
  let message = "您已經填寫過問卷了，感謝您的參與！";

  // 如果有填寫時間，顯示更詳細的訊息
  if (data.created_at) {
    const submitDate = new Date(data.created_at).toLocaleString("zh-TW");
    message = `您已經在 ${submitDate} 填寫過問卷了\n\n每位會員在活動期間只能填寫一次問卷\n感謝您的參與！`;
  }

  await showUniversalDialog({
    icon: "info",
    title: "問卷已填寫",
    text: message,
    confirmButtonText: "確定",
    showCancelButton: false,
  });
}

// ==================== 流程控制函數 ====================
// 1. 問卷流程啟動函數
async function startQuestionnaire() {
  try {
    if (typeof window === "undefined") return;

    loadingData.value = {
      message: "處理中...",
      subMessage: "正在檢查問卷狀態",
    };
    showLoadingPopup.value = true;

    // 檢查用戶是否已經填寫過問卷
    const hasSubmitted = await hasSubmittedQuestionnaire();

    closeLoadingPopup();

    if (hasSubmitted) {
      // 如果已經填寫過，不需要額外處理，hasSubmittedQuestionnaire 內部已經顯示彈窗
      return;
    }

    // 如果未填寫過，繼續流程
    loadingData.value = {
      message: "處理中...",
      subMessage: "正在準備問卷流程",
    };
    showLoadingPopup.value = true;

    // 生成流程安全令牌
    await securityManager.flow.generate();

    // 設置流程標記
    localStorage.setItem("pet2025_just_logged_in", "true");
    localStorage.setItem("pet2025_normal_flow", "true");

    closeLoadingPopup();

    return true;
  } catch (error) {
    console.error("問卷流程錯誤:", error);
    closeLoadingPopup();
    showUniversalDialog({
      icon: "error",
      title: "系統錯誤",
      text: "啟動問卷流程時發生錯誤，請稍後再試",
    });
  }
}

const closeLoadingPopup = () => {
  showLoadingPopup.value = false;
};

// 2. 驗證成功後執行問卷流程
async function proceedToSubmitQuestionnaire() {
  try {
    console.log("=== 開始執行問卷流程 ===");

    localStorage.removeItem("pet2025_just_logged_in");

    // 檢查流程安全令牌
    const flowToken = securityManager.flow.get();
    if (!flowToken) {
      console.error("流程安全令牌不存在或已過期");
      showUniversalDialog({
        icon: "warning",
        title: "安全驗證失敗",
        text: "驗證已過期，需要重新開始流程",
        confirmButtonText: "重新開始",
        showCancelButton: false,
      }).then(() => {
        startQuestionnaire();
      });
      return;
    }

    // 檢查 Turnstile token（非開發環境）
    if (!turnstileToken.value && !isDevelopment.value) {
      console.error("Turnstile token 不存在，需要重新驗證");
      showPostLoginVerificationDialog();
      return;
    }

    // 顯示問卷
    showQuestionnaire.value = true;
    console.log("=== 問卷顯示完成 ===");

    // 等待DOM更新後滾動到問卷區塊
    await nextTick();
    scrollToQuestionnaire();
  } catch (error) {
    console.error("問卷流程執行錯誤:", error);
    showUniversalDialog({
      icon: "error",
      title: "系統錯誤",
      text: "啟動問卷時發生錯誤，請稍後再試",
    });
  }
}

// XSS 防護函數
function sanitizeInput(input) {
  if (!input || typeof input !== "string") {
    return input;
  }

  return input
    .replace(/<[^>]*>/g, "")
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/\bon\w+\s*=/gi, "")
    .replace(/&lt;script/gi, "")
    .replace(/&lt;\/script/gi, "")
    .substring(0, 200);
}

// ==================== 用戶界面函數 ====================
// 登入後的驗證對話框
function showPostLoginVerificationDialog() {
  showVerificationPopup.value = true;
}

// 關閉驗證彈窗的函數
const closeVerificationPopup = () => {
  showVerificationPopup.value = false;

  if (
    typeof window !== "undefined" &&
    window.turnstile &&
    turnstileWidgetId.value
  ) {
    try {
      window.turnstile.remove(turnstileWidgetId.value);
      turnstileWidgetId.value = null;
    } catch (e) {
      console.error("清理 Turnstile 時發生錯誤:", e);
    }
  }
};

// 驗證彈窗開啟時的處理
const onVerificationPopupOpened = () => {
  loadTurnstileScript();
};

// 切換開發工具顯示
function toggleDebugTools() {
  showDebugTools.value = !showDebugTools.value;
}

// ==================== 調試功能 ====================
// 登出功能
function logout() {
  if (typeof window === "undefined") return;

  try {
    const domains = [
      "",
      window.location.hostname,
      `.${window.location.hostname}`,
      "udn.com",
      ".udn.com",
      "event.udn.com",
      "lab-event.udn.com",
    ];

    const paths = ["/", "/bd_fate2025", "/bd_pet2025"];
    const cookieNames = ["udnmember", "um2", "nickname", "fg_mail"];

    domains.forEach((domain) => {
      paths.forEach((path) => {
        cookieNames.forEach((name) => {
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}${domain ? "; domain=" + domain : ""}`;
        });
      });
    });

    localStorage.clear();

    isTurnstileVerified.value = false;
    isLoggedIn.value = false;
    showQuestionnaire.value = false;

    console.log("已清除所有登入相關狀態");
  } catch (e) {
    console.error("清除 Cookie 過程中發生錯誤:", e);
  }
}

// ==================== 生命週期 ====================
onMounted(async () => {
  // 註冊開發工具鍵盤快捷鍵
  const handleKeyDown = (event) => {
    if (event.shiftKey && event.key === "D") {
      toggleDebugTools();
    }
  };
  window.addEventListener("keydown", handleKeyDown);

  // 設置定期檢查登入狀態的計時器
  const loginCheckInterval = setInterval(updateLoginStatus, 5000);

  // 組件卸載時清理資源
  onBeforeUnmount(() => {
    window.removeEventListener("keydown", handleKeyDown);
    clearInterval(loginCheckInterval);
  });

  // 更新登入狀態
  updateLoginStatus();

  // 檢查來源頁面，如果是從登入頁面來的，清理可能的舊標記
  const referrer = document.referrer;
  const isFromLoginPage = referrer.includes("member.udn.com/member/login.jsp");

  if (isFromLoginPage) {
    console.log("檢測到從登入頁面直接進入，清理舊的流程標記");
    // 清理舊的流程標記，確保邏輯正確
    localStorage.removeItem("pet2025_normal_flow");
    localStorage.removeItem("pet2025_flow_token");
    localStorage.removeItem("pet2025_flow_token_expiry");
  }

  // 檢查是否首次訪問頁面
  const isFirstTimeCheck = !localStorage.getItem("login_checked");

  // 檢查是否從會員登入頁面返回
  const justLoggedIn =
    localStorage.getItem("pet2025_just_logged_in") === "true";

  if (justLoggedIn && isLoggedIn.value) {
    await handlePostLoginProcess();
  } else if (isLoggedIn.value && isFirstTimeCheck) {
    // 處理非正常流程登入（直接訪問已登入狀態的頁面）
    await handleNonNormalLogin();
  }
});

// 處理非正常流程登入
async function handleNonNormalLogin() {
  localStorage.setItem("login_checked", "true");

  const isNormalFlow = localStorage.getItem("pet2025_normal_flow") === "true";

  if (!isNormalFlow) {
    console.log("檢測到用戶不是從正常流程登入");

    showUniversalDialog({
      icon: "warning",
      title: "請使用正確的問卷流程",
      text: "請從活動首頁點擊「開始填寫」按鈕來完成問卷流程，\n直接使用登入網址將無法正常參與活動。",
      confirmButtonText: "我知道了",
      showCancelButton: false,
    });
  }
}

// 處理登入後返回的流程
async function handlePostLoginProcess() {
  console.log("檢測到從登入頁面返回");

  const hasFlowToken = !!securityManager.flow.get();
  const isNormalFlow = localStorage.getItem("pet2025_normal_flow") === "true";
  const justLoggedInFlag =
    localStorage.getItem("pet2025_just_logged_in") === "true";

  console.log("流程檢查結果:", {
    hasFlowToken,
    isNormalFlow,
    justLoggedInFlag,
  });

  // 更嚴格的檢查：必須同時滿足有正常流程標記、有流程令牌、有登入標記
  if (!isNormalFlow || !hasFlowToken || !justLoggedInFlag) {
    console.log("檢測到非正常流程登入");
    // 清理所有相關標記
    localStorage.removeItem("pet2025_just_logged_in");
    localStorage.removeItem("pet2025_normal_flow");
    securityManager.clearAll();

    handleNonNormalLogin();
    return;
  }

  // 正常流程處理
  try {
    // 檢查問卷狀態
    const hasSubmitted = await hasSubmittedQuestionnaire();

    if (hasSubmitted) {
      // 如果已經填寫過，不需要額外處理，hasSubmittedQuestionnaire 內部已經顯示彈窗
      return;
    }

    // 如果未填寫過，顯示驗證對話框
    showPostLoginVerificationDialog();
  } catch (error) {
    console.error("登入後流程錯誤:", error);
    showUniversalDialog({
      icon: "error",
      title: "系統錯誤",
      text: "啟動問卷流程時發生錯誤，請稍後再試",
    });
  }
}

// 問卷提交處理
async function onSubmit(data) {
  try {
    console.log("收到問卷數據:", data);

    loadingData.value = { message: "提交中..." };
    showLoadingPopup.value = true;

    const result = await submitData(data.answers);

    closeLoadingPopup();

    if (result.status === "success") {
      showUniversalDialog({
        icon: "success",
        title: "提交成功",
        text: "感謝您的參與！",
        confirmButtonText: "確定",
        showCancelButton: false,
      });
      showQuestionnaire.value = false;
    } else {
      showUniversalDialog({
        icon: "error",
        title: "提交失敗",
        text: result.message || "請稍後再試",
        confirmButtonText: "確定",
        showCancelButton: false,
      });
    }
  } catch (error) {
    console.error("問卷提交錯誤:", error);
    closeLoadingPopup();

    showUniversalDialog({
      icon: "error",
      title: "系統錯誤",
      text: "請稍後再試",
      confirmButtonText: "確定",
      showCancelButton: false,
    });
  }
}

// 問卷提交 API
async function submitData(answers) {
  try {
    const flowToken = securityManager.flow.get();
    const turnstileTokenValue =
      turnstileToken.value ||
      localStorage.getItem("temp_turnstile_token") ||
      null;
    const udnmember = getCookieValue("udnmember") || "";
    const um2 = getCookieValue("um2") || "";

    const data = {
      udnmember: sanitizeInput(udnmember),
      um2: sanitizeInput(um2),
      flow_token: flowToken,
      turnstile_token: turnstileTokenValue,
      ...answers, // 展開 answer1 到 answer15
    };

    const apiUrl = getApiUrl("saveUserData.php");
    const response = await axios.post(apiUrl, data, {
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      withCredentials: true,
      timeout: 30000,
    });

    return response.data;
  } catch (error) {
    console.error("提交失敗:", error);

    let msg = "提交失敗";
    if (error.response?.data?.message) {
      msg = error.response.data.message;
    }

    return { status: "error", message: msg };
  }
}

// 滾動到問卷區塊的函數
function scrollToQuestionnaire() {
  const questionnaireElement = document.querySelector(".ques");
  if (questionnaireElement) {
    questionnaireElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    console.log("已滾動到問卷區塊");
  } else {
    // 如果問卷元素還沒載入，延遲一點再試
    setTimeout(() => {
      const element = document.querySelector(".ques");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        console.log("延遲滾動到問卷區塊");
      }
    }, 300);
  }
}
</script>

<style lang="scss" scoped>
.questionnaire-container {
  min-height: 100vh;
  padding: 20px;
}

/* 開發工具樣式 */
.debug-tools {
  margin-top: 50px;
  padding: 15px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  background-color: #f5f5f5;
  text-align: left;

  h3 {
    margin-top: 0;
    color: #666;
    font-size: 18px;
  }

  .debug-btn {
    padding: 8px 16px;
    background-color: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
