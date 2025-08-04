<template>
  <Banner
    @startDivination="startQuestionnaire"
    @goQues="goQues"
    :loginUrl="loginUrl"
    :isLoggedIn="isLoggedIn"
  />
  <div class="questionnaire-container">
    <!-- 加載中彈窗 -->
    <!-- <Loading_popup
      :is-visible="showLoadingPopup"
      :loading-data="loadingData"
      @close="closeLoadingPopup"
    /> -->
    <!-- 驗證彈窗 -->
    <Verification_popup
      :is-visible="showVerificationPopup"
      @close="closeVerificationPopup"
      @opened="onVerifyOpened"
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
// import Loading_popup from "../components/Loading_popup.vue";
import Verification_popup from "../components/Verification_popup.vue";
import Universal_popup from "../components/Universal_popup.vue";
import Questionnaire from "../components/Questionnaire.vue";

// ==================== 基本狀態管理 ====================
const config = useRuntimeConfig();
const turnstileToken = ref(null);
const turnstileWidgetId = ref(null);
const isTurnstileVerified = ref(false);
const isLoggedIn = ref(false);
const showQuestionnaire = ref(false);

// 彈窗相關
// const showLoadingPopup = ref(false);
const loadingData = ref({});
const showVerificationPopup = ref(false);
const showUniversalPopup = ref(false);
const universalPopupData = ref({});
// 添加問卷配置狀態
const questionnaireConfig = ref(null);

// 創建統一的彈窗顯示函數
function showDialog(options) {
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
    window._universalPopupResolve = resolve;
  });
}

// 關閉彈窗的函數
const closeUniversalPopup = () => {
  showUniversalPopup.value = false;
  // 清理 Promise resolve 函數
  window._universalPopupResolve = null;
};

const handleUniversalConfirm = () => {
  if (window._universalPopupResolve) {
    const resolve = window._universalPopupResolve;
    window._universalPopupResolve = null; // 立即清理，防止重複調用
    resolve({ isConfirmed: true });
  }
};

const handleUniversalCancel = () => {
  if (window._universalPopupResolve) {
    const resolve = window._universalPopupResolve;
    window._universalPopupResolve = null; // 立即清理，防止重複調用
    resolve({ isDismissed: true, dismiss: "cancel" });
  }
};

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
    redirectUrl = "https://event.udn.com/bd_pet2025/";
  } else if (
    allowedHosts.includes(hostname) ||
    hostname.startsWith("localhost")
  ) {
    redirectUrl = "https://lab-event.udn.com/bd_pet2025/";
  } else {
    redirectUrl = "https://lab-event.udn.com/bd_pet2025/";
  }

  return `https://member.udn.com/member/login.jsp?site=bd_pet2025&again=y&redirect=${redirectUrl}`;
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

// 更新登入狀態 - 修正執行順序
function updateLoginStatus() {
  const wasLoggedIn = isLoggedIn.value;
  const udnmember = getCookieValue("udnmember");
  const um2 = getCookieValue("um2");
  const currentlyLoggedIn = !!(udnmember && um2);

  // 只有在從未登入變為登入狀態時，才檢查是否為非正常流程
  if (!wasLoggedIn && currentlyLoggedIn) {
    console.log("檢測到登入狀態變化，檢查是否為非正常流程進入");

    // 立即檢查非正常進入，不延遲
    const shouldBlock = checkNonNormalEntry();

    if (shouldBlock) {
      // 如果檢測到非正常進入，不要設置登入狀態
      console.log("非正常進入已處理，保持登出狀態");
      return;
    }
  }

  // 只有在沒有被攔截的情況下才設置登入狀態
  isLoggedIn.value = currentlyLoggedIn;
}

// 檢查非正常流程進入 - 修改為同步函數並返回是否應該攔截
function checkNonNormalEntry() {
  const justLoggedInFlag =
    localStorage.getItem("pet2025_just_logged_in") === "true";
  const isNormalFlow = localStorage.getItem("pet2025_normal_flow") === "true";
  const hasFlowToken = !!securityManager.flow.get();

  console.log("非正常流程檢查:", {
    justLoggedInFlag,
    isNormalFlow,
    hasFlowToken,
  });

  // 如果沒有任何正常流程標記，說明是非正常進入
  if (!justLoggedInFlag && !isNormalFlow && !hasFlowToken) {
    console.log("檢測到非正常流程進入，立即強制登出並顯示警告");

    // 立即強制登出
    performCompleteLogout();

    // 顯示警告彈窗
    showDialog({
      icon: "warning",
      title: "請使用正確流程",
      text: "請從活動首頁點擊「開始填問卷」按鈕來參與活動。\n直接使用登入網址將無法參與。",
      confirmButtonText: "我知道了",
      showCancelButton: false,
    });

    return true; // 返回true表示應該攔截
  }

  return false; // 返回false表示正常流程
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
        proceedToSubmit();
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
        // 修改為3分鐘，加上2分鐘緩衝 = 總共5分鐘過期
        const expiryTime = Date.now() + 3 * 60 * 1000;
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

      const graceTime = 2 * 60 * 1000; // 保持2分鐘緩衝

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
async function checkSubmitted() {
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
      // closeLoadingPopup();
      await showSubmittedDialog(response.data);
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
        // closeLoadingPopup(); // 先關閉loading彈窗
        await showDialog({
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
async function showSubmittedDialog(data) {
  let message = "您已經填寫過問卷了，感謝您的參與！";

  // 如果有填寫時間，顯示更詳細的訊息
  if (data.created_at) {
    const submitDate = new Date(data.created_at).toLocaleString("zh-TW");
    message = `您已經在 ${submitDate} 填寫過問卷了\n\n每位會員在活動期間只能填寫一次問卷\n感謝您的參與！`;
  }

  await showDialog({
    icon: "info",
    title: "問卷已填寫",
    text: message,
    confirmButtonText: "確定",
    showCancelButton: false,
  });
}

// ==================== 流程控制函數 ====================
// 1. 問卷流程啟動函數 - 只在初始點擊時生成令牌
async function startQuestionnaire() {
  try {
    if (typeof window === "undefined") return;

    const hasSubmitted = await checkSubmitted();

    if (hasSubmitted) {
      return;
    }

    // 先清除舊的標記
    localStorage.removeItem("pet2025_just_logged_in");
    localStorage.removeItem("pet2025_normal_flow");
    securityManager.clearAll();

    // 生成新的流程令牌 - 只在初始流程時生成
    await securityManager.flow.generate();

    // 設置新的一次性標記 - 只在初始流程時設置
    localStorage.setItem("pet2025_just_logged_in", "true");
    localStorage.setItem("pet2025_normal_flow", "true");

    return true;
  } catch (error) {
    console.error("問卷流程錯誤:", error);

    // 錯誤時清除標記
    localStorage.removeItem("pet2025_just_logged_in");
    localStorage.removeItem("pet2025_normal_flow");

    showDialog({
      icon: "error",
      title: "系統錯誤",
      text: "啟動問卷時發生錯誤，請稍後再試",
    });
  }
}

// const closeLoadingPopup = () => {
//   showLoadingPopup.value = false;
// };

// 2. 驗證成功後執行問卷流程
async function proceedToSubmit() {
  try {
    console.log("=== 開始執行問卷流程 ===");

    localStorage.removeItem("pet2025_just_logged_in");

    // 檢查流程安全令牌
    const flowToken = securityManager.flow.get();
    if (!flowToken) {
      console.error("流程安全令牌不存在或已過期，強制登出");

      await showDialog({
        icon: "warning",
        title: "停留時間過長",
        text: "由於安全考量，系統將重置狀態。",
        confirmButtonText: "確定",
        showCancelButton: false,
      });

      // 執行完全登出而不是重新生成令牌
      performCompleteLogout();
      return;
    }

    // 檢查 Turnstile token（非開發環境）
    if (!turnstileToken.value && !isDevelopment.value) {
      console.error("Turnstile token 不存在，需要重新驗證");
      showVerifyDialog();
      return;
    }

    // 顯示問卷
    showQuestionnaire.value = true;
    console.log("=== 問卷顯示完成 ===");

    // 等待DOM更新後滾動到問卷區塊
    await nextTick();
    scrollToQues();
  } catch (error) {
    console.error("問卷流程執行錯誤:", error);

    // 發生錯誤時也登出
    performCompleteLogout();
  }
}

// 完全登出功能 - 加強清除邏輯
function performCompleteLogout() {
  if (typeof window === "undefined") return;

  try {
    console.log("執行完全登出，清除所有狀態...");

    // 清除所有domain的cookies
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

    // 清除所有localStorage
    localStorage.clear();

    // 立即更新所有狀態
    isTurnstileVerified.value = false;
    isLoggedIn.value = false;
    showQuestionnaire.value = false;
    turnstileToken.value = null;
    turnstileWidgetId.value = null;

    // 清除安全令牌
    securityManager.clearAll();

    console.log("完全登出完成");
  } catch (e) {
    console.error("清除狀態過程中發生錯誤:", e);
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
function showVerifyDialog() {
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
const onVerifyOpened = () => {
  loadTurnstileScript();
};

// 修改goQues函數 - 不重新生成令牌，只檢查現有令牌
async function goQues() {
  try {
    console.log("用戶點擊前往填問卷");

    // 首先檢查是否已經填寫過問卷
    const hasSubmitted = await checkSubmitted();

    if (hasSubmitted) {
      // 如果已經填寫過，直接返回（checkSubmitted內部會顯示已填寫的彈窗）
      return;
    }

    // 檢查是否有有效的流程令牌 - 不重新生成
    const hasFlowToken = !!securityManager.flow.get();

    if (!hasFlowToken) {
      console.log("沒有流程令牌，顯示非正常流程警告");

      showDialog({
        icon: "warning",
        title: "請使用正確的流程",
        text: "請從活動首頁點擊「登入立即填問卷」按鈕來參與活動。\n直接使用登入網址將無法參與。",
        confirmButtonText: "我知道了",
        showCancelButton: false,
      });
      return;
    }

    // 直接顯示問卷，不需要機器人驗證
    showQuestionnaire.value = true;
    console.log("=== 問卷顯示完成 ===");

    // 等待DOM更新後滾動到問卷區塊
    await nextTick();
    scrollToQues();
  } catch (error) {
    console.error("前往填問卷錯誤:", error);

    showDialog({
      icon: "error",
      title: "系統錯誤",
      text: "啟動問卷時發生錯誤，請稍後再試",
      confirmButtonText: "確定",
      showCancelButton: false,
    });
  }
}

// ==================== 生命週期 ====================
onMounted(async () => {
  // 設置定期檢查登入狀態的計時器
  const loginCheckInterval = setInterval(updateLoginStatus, 5000);

  // 組件卸載時清理資源
  onBeforeUnmount(() => {
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
    await handlePostLogin();
  } else if (isLoggedIn.value && isFirstTimeCheck) {
    // 處理非正常流程登入（直接訪問已登入狀態的頁面）
    await checkExistingUser();
  }
});

// 處理登入後流程
async function handlePostLogin() {
  console.log("檢測到從登入頁面返回");

  try {
    console.log("檢查用戶問卷狀態...");

    loadingData.value = {
      message: "檢查中...",
      subMessage: "正在確認您的狀態",
    };
    // showLoadingPopup.value = true;

    const hasSubmitted = await checkSubmitted();

    // closeLoadingPopup();

    if (hasSubmitted) {
      localStorage.removeItem("pet2025_just_logged_in");
      return;
    }

    console.log("檢查流程有效性...");

    // 嚴格檢查：必須同時有這三個條件
    const justLoggedInFlag =
      localStorage.getItem("pet2025_just_logged_in") === "true";
    const isNormalFlow = localStorage.getItem("pet2025_normal_flow") === "true";
    const flowToken = securityManager.flow.get();

    console.log("流程檢查:", {
      justLoggedInFlag,
      isNormalFlow,
      hasFlowToken: !!flowToken,
    });

    // 核心安全檢查：必須同時具備三個條件
    if (!justLoggedInFlag || !isNormalFlow || !flowToken) {
      console.log("檢測到非正常流程進入，立即登出");

      // 清除所有可能的標記，防止重複使用
      localStorage.removeItem("pet2025_just_logged_in");
      localStorage.removeItem("pet2025_normal_flow");
      securityManager.clearAll();

      // 立即強制完全登出
      performCompleteLogout();

      // 同時顯示警告彈窗（不等待用戶確認）
      showDialog({
        icon: "warning",
        title: "請正常進入",
        text: "請從活動首頁點擊「開始填問卷」按鈕來參與活動。\n直接使用登入網址將無法參與。",
        confirmButtonText: "我知道了",
        showCancelButton: false,
      });

      return;
    }

    // 正常流程：立即清除一次性標記，防止重複使用
    localStorage.removeItem("pet2025_just_logged_in");
    localStorage.removeItem("pet2025_normal_flow");

    // 顯示驗證對話框
    showVerifyDialog();
  } catch (error) {
    // closeLoadingPopup();
    console.error("登入後流程錯誤:", error);

    // 發生錯誤時清除標記並登出
    localStorage.removeItem("pet2025_just_logged_in");
    localStorage.removeItem("pet2025_normal_flow");
    securityManager.clearAll();
    performCompleteLogout();
  }
}

// 檢查已登入用戶狀態 - 完全重寫
async function checkExistingUser() {
  localStorage.setItem("login_checked", "true");

  console.log("檢測到已登入用戶，檢查是否為非正常進入...");

  // 檢查是否有正常流程的完整標記
  const justLoggedInFlag =
    localStorage.getItem("pet2025_just_logged_in") === "true";
  const isNormalFlow = localStorage.getItem("pet2025_normal_flow") === "true";
  const hasFlowToken = !!securityManager.flow.get();

  console.log("非正常登入檢查:", {
    justLoggedInFlag,
    isNormalFlow,
    hasFlowToken,
  });

  // 如果沒有完整的正常流程標記，就是非正常進入
  if (!justLoggedInFlag || !isNormalFlow || !hasFlowToken) {
    console.log("檢測到非正常登入，拒絕進入");

    await showDialog({
      icon: "warning",
      title: "請使用正確的流程",
      text: "請從活動首頁點擊「開始填問卷」按鈕來參與活動。\n直接使用登入網址將無法參與。",
      confirmButtonText: "我知道了",
      showCancelButton: false,
    });

    return;
  }

  // 如果有完整標記，檢查問卷狀態
  try {
    loadingData.value = {
      message: "檢查中...",
      subMessage: "正在確認您的問卷狀態",
    };
    // showLoadingPopup.value = true;

    const hasSubmitted = await checkSubmitted();

    // closeLoadingPopup();

    if (hasSubmitted) {
      console.log("用戶已填寫過問卷");
      // 清除標記
      localStorage.removeItem("pet2025_just_logged_in");
      localStorage.removeItem("pet2025_normal_flow");
      return;
    }

    // 正常流程：立即清除一次性標記
    localStorage.removeItem("pet2025_just_logged_in");
    localStorage.removeItem("pet2025_normal_flow");

    // 顯示驗證
    showVerifyDialog();
  } catch (error) {
    // closeLoadingPopup();
    console.error("檢查用戶狀態時發生錯誤:", error);

    // 錯誤時清除標記
    localStorage.removeItem("pet2025_just_logged_in");
    localStorage.removeItem("pet2025_normal_flow");
  }
}

// 問卷提交處理
async function onSubmit(data) {
  try {
    console.log("收到問卷數據:", data);

    loadingData.value = { message: "提交中..." };
    // showLoadingPopup.value = true;

    const result = await submitData(data.answers);

    // closeLoadingPopup();

    if (result.status === "success") {
      showDialog({
        icon: "success",
        title: "提交成功",
        text: "感謝您的參與！",
        confirmButtonText: "確定",
        showCancelButton: false,
      });
      showQuestionnaire.value = false;
    } else {
      showDialog({
        icon: "error",
        title: "提交失敗",
        text: result.message || "請稍後再試",
        confirmButtonText: "確定",
        showCancelButton: false,
      });
    }
  } catch (error) {
    console.error("問卷提交錯誤:", error);
    // closeLoadingPopup();

    showDialog({
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
      ...answers,
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
function scrollToQues() {
  const quesElement = document.querySelector(".ques");
  if (quesElement) {
    quesElement.scrollIntoView({
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
</style>
