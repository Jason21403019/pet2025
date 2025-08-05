<template>
  <!-- Google Tag Manager (noscript) -->
  <noscript
    ><iframe
      src="https://www.googletagmanager.com/ns.html?id=GTM-NMFFZ35"
      height="0"
      width="0"
      style="display: none; visibility: hidden"
    ></iframe
  ></noscript>
  <!-- End Google Tag Manager (noscript) --><noscript>
    <img src="http://b.scorecardresearch.com/p?c1=2&c2=7390954&cv=2.0&cj=1" />
  </noscript>

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

  <NuxtPage />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import axios from "axios";
import Verification_popup from "./components/Verification_popup.vue";
import Universal_popup from "./components/Universal_popup.vue";

// 檢查當前路由是否為 admin 頁面
// const route = useRoute();
// const isAdminPage = computed(() => route.name === "admin");

// ==================== 基本狀態管理 ====================
const config = useRuntimeConfig();
const turnstileToken = ref(null);
const turnstileWidgetId = ref(null);
const isTurnstileVerified = ref(false);
const isLoggedIn = ref(false);

// 分頁同步控制 - 簡單標記是否允許同步
const allowLoginSync = ref(false);

// 彈窗相關
const loadingData = ref({});
const showVerificationPopup = ref(false);
const showUniversalPopup = ref(false);
const universalPopupData = ref({});

// 簡化的防重複機制
let isDialogOpen = false;

// 創建統一的彈窗顯示函數
function showDialog(options) {
  // 如果已經有彈窗開啟，忽略新的彈窗請求
  if (isDialogOpen) {
    console.log("彈窗已開啟，忽略新請求");
    return Promise.resolve({ isDismissed: true });
  }

  isDialogOpen = true;

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
  isDialogOpen = false;

  if (window._universalPopupResolve) {
    const resolve = window._universalPopupResolve;
    window._universalPopupResolve = null;
    resolve({ isDismissed: true, dismiss: "backdrop" });
  }
};

const handleUniversalConfirm = () => {
  if (window._universalPopupResolve) {
    const resolve = window._universalPopupResolve;
    window._universalPopupResolve = null;
    resolve({ isConfirmed: true });
  }

  showUniversalPopup.value = false;
  isDialogOpen = false;
};

const handleUniversalCancel = () => {
  if (window._universalPopupResolve) {
    const resolve = window._universalPopupResolve;
    window._universalPopupResolve = null;
    resolve({ isDismissed: true, dismiss: "cancel" });
  }

  showUniversalPopup.value = false;
  isDialogOpen = false;
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

// 更新登入狀態 - 加入同步控制
function updateLoginStatus() {
  if (!allowLoginSync.value) {
    console.log("舊分頁，不同步登入狀態");
    return;
  }

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

    // 顯示警告彈窗
    showDialog({
      icon: "warning",
      title: "請使用正確流程",
      text: "請從活動首頁點擊「開始填問卷」按鈕來參與活動。\n直接使用登入網址將無法參與。",
      confirmButtonText: "我知道了",
      showCancelButton: false,
    });
    // 立即強制登出
    performCompleteLogout();
    return true;
  }

  return false;
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

    if (
      response.data.status === "success" &&
      response.data.completed === true
    ) {
      console.log("資料庫確認：用戶已填寫過問卷");

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

    // 發送事件給子組件
    window.dispatchEvent(new CustomEvent("questionnaire-start"));
    console.log("=== 問卷流程完成 ===");
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

    // 只需要檢查是否已經填寫過問卷
    const hasSubmitted = await checkSubmitted();

    if (hasSubmitted) {
      // 如果已經填寫過，直接返回（checkSubmitted內部會顯示已填寫的彈窗）
      return;
    }

    // 直接啟動問卷區塊
    window.dispatchEvent(new CustomEvent("questionnaire-start"));
    console.log("=== 移動到問卷區塊 ===");
  } catch (error) {
    console.error("前往填問卷錯誤:", error);

    showDialog({
      icon: "error",
      title: "系統錯誤",
      text: "移動到問卷時發生錯誤，請稍後再試",
      confirmButtonText: "確定",
      showCancelButton: false,
    });
  }
}

// ==================== 生命週期 ====================
onMounted(async () => {
  // 檢查是否在 completed 頁面
  const isOnCompletedPage =
    localStorage.getItem("pet2025_on_completed_page") === "true";
  if (isOnCompletedPage) {
    console.log("在完成頁面，跳過登入狀態檢查");
    allowLoginSync.value = false;
    return;
  }

  // 檢查是否為從登入頁面返回
  const referrer = document.referrer;
  const isFromLoginPage = referrer.includes("member.udn.com/member/login.jsp");
  const justLoggedIn =
    localStorage.getItem("pet2025_just_logged_in") === "true";
  const isNormalFlow = localStorage.getItem("pet2025_normal_flow") === "true";
  const hasFlowToken = !!securityManager.flow.get();

  console.log("頁面載入檢查:", {
    isFromLoginPage,
    justLoggedIn,
    isNormalFlow,
    hasFlowToken,
    referrer,
  });

  // 🆕 優先處理非正常流程：從登入頁面回來但沒有正常流程標記
  if (isFromLoginPage && !justLoggedIn && !isNormalFlow && !hasFlowToken) {
    console.log("檢測到從登入頁面直接進入（非正常流程）");

    // 檢查是否有登入 cookie
    const udnmember = getCookieValue("udnmember");
    const um2 = getCookieValue("um2");

    if (udnmember && um2) {
      console.log("有登入 cookie，執行非正常流程檢查");
      checkNonNormalEntry(); // 直接調用，會顯示彈窗並強制登出
    }

    allowLoginSync.value = false;
    return; // 結束處理
  }

  // 正常的 allowLoginSync 邏輯
  if (
    (justLoggedIn && isNormalFlow && hasFlowToken) ||
    (!isFromLoginPage && (isNormalFlow || hasFlowToken))
  ) {
    console.log("允許同步登入狀態的分頁");
    allowLoginSync.value = true;

    // 設置定期檢查登入狀態的計時器
    const loginCheckInterval = setInterval(updateLoginStatus, 5000);

    // 組件卸載時清理資源
    onBeforeUnmount(() => {
      clearInterval(loginCheckInterval);
    });
  } else {
    console.log("不允許同步登入狀態");
    allowLoginSync.value = false;
  }

  // 更新登入狀態
  updateLoginStatus();

  if (isFromLoginPage) {
    console.log("檢測到從登入頁面直接進入，清理舊的流程標記");
    // 清理舊的流程標記，確保邏輯正確
    localStorage.removeItem("pet2025_normal_flow");
    localStorage.removeItem("pet2025_flow_token");
    localStorage.removeItem("pet2025_flow_token_expiry");
  }

  // 檢查是否首次訪問頁面
  const isFirstTimeCheck = !localStorage.getItem("login_checked");

  if (justLoggedIn && allowLoginSync.value) {
    await handlePostLogin();
  } else if (isLoggedIn.value && isFirstTimeCheck && allowLoginSync.value) {
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

    const hasSubmitted = await checkSubmitted();

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

    // 區分不同的錯誤情況
    if (!justLoggedInFlag || !isNormalFlow) {
      // 沒有正常流程標記 = 非正常進入
      console.log("檢測到非正常流程進入，立即登出");

      localStorage.removeItem("pet2025_just_logged_in");
      localStorage.removeItem("pet2025_normal_flow");
      securityManager.clearAll();
      performCompleteLogout();

      showDialog({
        icon: "warning",
        title: "請正常進入",
        text: "請從活動首頁點擊「開始填問卷」按鈕來參與活動。\n直接使用登入網址將無法參與。",
        confirmButtonText: "我知道了",
        showCancelButton: false,
      });

      return;
    } else if (!flowToken) {
      // 有正常流程標記但令牌過期 = 停留時間過長
      console.log("檢測到停留時間過長，令牌已過期");

      localStorage.removeItem("pet2025_just_logged_in");
      localStorage.removeItem("pet2025_normal_flow");
      securityManager.clearAll();
      performCompleteLogout();

      showDialog({
        icon: "warning",
        title: "停留時間過長",
        text: "由於安全考量，系統將重置狀態。請重新開始填寫流程。",
        confirmButtonText: "確定",
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

    const hasSubmitted = await checkSubmitted();

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
    console.error("檢查用戶狀態時發生錯誤:", error);

    // 錯誤時清除標記
    localStorage.removeItem("pet2025_just_logged_in");
    localStorage.removeItem("pet2025_normal_flow");
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

// 提供給子組件
provide("isLoggedIn", isLoggedIn);
provide("updateLoginStatus", updateLoginStatus);
provide("loginUrl", loginUrl);
provide("startQuestionnaire", startQuestionnaire);
provide("goQues", goQues);
provide("performCompleteLogout", performCompleteLogout);
provide("showDialog", showDialog);
provide("checkSubmitted", checkSubmitted);
provide("submitData", submitData);
provide("turnstileToken", turnstileToken);
provide("isTurnstileVerified", isTurnstileVerified);
provide("securityManager", securityManager);
provide("getCookieValue", getCookieValue);
provide("sanitizeInput", sanitizeInput);

// 開發環境檢查
const isDevelopment = computed(() => {
  return (
    process.env.NODE_ENV === "development" ||
    window?.location?.hostname === "localhost" ||
    window?.location?.hostname?.includes("localhost")
  );
});
provide("isDevelopment", isDevelopment);
</script>

<style lang="scss">
@use "~/assets/css/reset.css";
@use "~/assets/css/sweetalert.scss";

html {
  scroll-behavior: smooth;
}

body {
  font-family: "Noto Sans TC", sans-serif;
}
</style>
