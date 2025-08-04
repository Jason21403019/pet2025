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

  <!-- 只在非 admin 頁面顯示導覽列 -->
  <Nav v-if="!isAdminPage" />
  <NuxtPage />
</template>

<script setup>
// 檢查當前路由是否為 admin 頁面
const route = useRoute();
const isAdminPage = computed(() => route.name === "admin");

// 提供統一的登入狀態給所有子組件
const isLoggedIn = ref(false);

// 檢查登入狀態的函數（與 index.vue 相同的邏輯）
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

function updateLoginStatus() {
  const udnmember = getCookieValue("udnmember");
  const um2 = getCookieValue("um2");
  const cookieBasedLogin = !!(udnmember && um2);

  // 檢查是否有完整的正常流程標記
  const justLoggedInFlag =
    localStorage.getItem("pet2025_just_logged_in") === "true";
  const isNormalFlow = localStorage.getItem("pet2025_normal_flow") === "true";
  const hasFlowToken = !!localStorage.getItem("pet2025_flow_token");

  // 如果沒有完整的正常流程標記，即使有 cookie 也不顯示登出按鈕
  if (
    cookieBasedLogin &&
    (!justLoggedInFlag || !isNormalFlow || !hasFlowToken)
  ) {
    console.log("App: 檢測到非正常流程，不顯示登出按鈕");
    isLoggedIn.value = false;
    return;
  }

  isLoggedIn.value = cookieBasedLogin;
}

// 定期檢查登入狀態
onMounted(() => {
  updateLoginStatus();
  const loginCheckInterval = setInterval(updateLoginStatus, 5000);

  onBeforeUnmount(() => {
    clearInterval(loginCheckInterval);
  });
});

// 提供給子組件
provide("isLoggedIn", isLoggedIn);
provide("updateLoginStatus", updateLoginStatus);
</script>

<style lang="scss">
@use "~/assets/css/reset.css";
@use "~/assets/css/sweetalert.scss";

html {
  scroll-behavior: smooth;
}
body {
  // background: url("/imgs/bg.jpg") top center;
  background: #ffd89b;
  background-repeat: no-repeat;
  font-family: "Noto Sans TC", sans-serif;
  @media (max-width: 768px) {
    // background: url("/imgs/m_bg.jpg") top center;
  }
}
</style>
