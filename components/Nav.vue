<template>
  <nav class="navbar">
    <!-- 直接使用 navbar__content，不使用 Nav_container -->
    <div
      class="navbar__content"
      :class="{ 'navbar__content--scrolled': isScrolled }"
    >
      <div class="navbar__logo">
        <NuxtLink
          to="https://udn.com/news/index"
          target="_blank"
          class="navbar__udn-logo"
        >
          <img
            src="/imgs/logo.png"
            alt="logo_udn_Logo"
            class="navbar__udn-logo-image"
          />
        </NuxtLink>
        <div class="navbar__pet-logo">
          <img
            src="/imgs/pet_logo.png"
            alt="Pet Logo"
            class="navbar__pet-logo-image"
          />
        </div>
      </div>

      <div class="navbar__right">
        <button
          @click="logout"
          class="navbar__logout"
          aria-label="登出"
          v-if="isLoggedIn"
        >
          登出
        </button>

        <div
          class="navbar__links"
          :class="{ 'navbar__links--active': isMobileMenuOpen }"
        >
          <NuxtLink
            to="/"
            class="navbar__link"
            @click="isMobileMenuOpen = false"
            >首頁</NuxtLink
          >
          <NuxtLink
            to="#activity"
            class="navbar__link"
            @click="isMobileMenuOpen = false"
            >活動辦法</NuxtLink
          >

          <!-- <div class="navbar__dropdown" @click="toggleDropdown"> -->
          <!-- <span class="navbar__link navbar__link--dropdown">
              毛孩百科全收錄
              <svg
                class="navbar__dropdown-arrow"
                :class="{
                  'navbar__dropdown-arrow--open': mobileDropdownOpen,
                }"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M3 4.5L6 7.5L9 4.5"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span> -->
          <!-- 
            <div
              class="navbar__dropdown-menu"
              :class="{
                'navbar__dropdown-menu--mobile-show': mobileDropdownOpen,
              }"
            >
              <NuxtLink
                to="/pet-food-sounds"
                class="navbar__dropdown-item"
                @click="closeAllMenus"
              >
                毛孩貪吃聲音
              </NuxtLink>
              <NuxtLink
                to="/pet-medical-sounds"
                class="navbar__dropdown-item"
                @click="closeAllMenus"
              >
                毛孩醫療聲音
              </NuxtLink>
              <a
                href="https://example.com/pet-secrets"
                target="_blank"
                class="navbar__dropdown-item"
                @click="closeAllMenus"
              >
                毛孩大揭密
              </a>
            </div> -->
          <!-- </div> -->
        </div>

        <div class="navbar__social">
          <a
            :href="facebookShareUrl"
            target="_blank"
            class="navbar__social-link navbar__social-link--facebook"
            aria-label="分享到臉書"
          >
            <img
              src="/imgs/share_fb.svg"
              alt="Facebook"
              class="navbar__social-icon"
            />
          </a>
          <a
            :href="lineShareUrl"
            target="_blank"
            class="navbar__social-link navbar__social-link--line"
            aria-label="分享到LINE"
          >
            <img
              src="/imgs/share_line.svg"
              alt="LINE"
              class="navbar__social-icon"
            />
          </a>
        </div>

        <div
          class="navbar__hamburger"
          :class="{ 'navbar__hamburger--active': isMobileMenuOpen }"
          @click="toggleMobileMenu"
        >
          <span class="navbar__hamburger-line"></span>
          <span class="navbar__hamburger-line"></span>
          <span class="navbar__hamburger-line"></span>
        </div>
      </div>
    </div>

    <div
      v-if="isMobileMenuOpen"
      class="navbar__backdrop"
      @click="isMobileMenuOpen = false"
    ></div>

    <Universal_popup
      :is-visible="showWinnerListPopup"
      :popup-data="winnerListPopupData"
      @close="closeWinnerListPopup"
      @confirm="handleWinnerListConfirm"
    />
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, inject } from "vue";
import Universal_popup from "./Universal_popup.vue";

const isMobileMenuOpen = ref(false);
const isScrolled = ref(false);
const showWinnerListPopup = ref(false);
const scrollThreshold = 40;

// 使用注入的登入狀態和方法
const isLoggedIn = inject("isLoggedIn", ref(false));
const updateLoginStatus = inject("updateLoginStatus", () => {});
const performCompleteLogout = inject("performCompleteLogout", () => {});

// 下拉選單狀態 - 簡化為只用一個狀態
const mobileDropdownOpen = ref(false);

const winnerListConfig = {
  announceDate: "2025年8月15日",
  winnerListUrl: "https://udn.com/news/index",
  isAnnounced: false,
};

const winnerListPopupData = computed(() => {
  if (winnerListConfig.isAnnounced) {
    return {
      icon: "success",
      title: "中獎名單",
      text: "恭喜得獎者！點擊下方按鈕查看完整中獎名單。",
      confirmButtonText: "查看中獎名單",
      showCancelButton: true,
      cancelButtonText: "稍後查看",
    };
  } else {
    return {
      icon: "warning",
      title: "中獎名單尚未公布",
      text: `中獎名單將於 ${winnerListConfig.announceDate} 公布，\n敬請期待！`,
      confirmButtonText: "我知道了",
      showCancelButton: false,
    };
  }
});

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  // 關閉手機版時也關閉下拉選單
  if (!isMobileMenuOpen.value) {
    mobileDropdownOpen.value = false;
  }
}

// 統一的下拉選單切換函數
function toggleDropdown() {
  mobileDropdownOpen.value = !mobileDropdownOpen.value;
}

// 關閉所有選單
function closeAllMenus() {
  isMobileMenuOpen.value = false;
  mobileDropdownOpen.value = false;
}

function handleScroll() {
  isScrolled.value = window.scrollY > scrollThreshold;
}

function handleWinnerListClick() {
  isMobileMenuOpen.value = false;
  showWinnerListPopup.value = true;
}

function closeWinnerListPopup() {
  showWinnerListPopup.value = false;
}

function handleWinnerListConfirm() {
  if (winnerListConfig.isAnnounced) {
    window.open(winnerListConfig.winnerListUrl, "_blank");
  }
  closeWinnerListPopup();
}

const getLastFortuneResult = () => {
  return localStorage.getItem("last_fortune_result") || "heart";
};

const baseShareUrl = computed(() => {
  const lastResult = getLastFortuneResult();
  const baseUrl = "https://lab-event.udn.com/bd_pet2025";
  return `${baseUrl}`;
});

const facebookShareUrl = computed(() => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(baseShareUrl.value)}`;
});

const lineShareUrl = computed(() => {
  const shareText = "快來幸福花火轉一夏！看看你會抽到什麼煙火！";
  return `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(baseShareUrl.value)}&text=${encodeURIComponent(shareText)}`;
});

// 使用注入的登出功能
function logout() {
  performCompleteLogout();
  window.location.reload();
}

onMounted(() => {
  if (window.scrollY > scrollThreshold) {
    isScrolled.value = true;
  }

  window.addEventListener("scroll", handleScroll);

  // 使用注入的 updateLoginStatus
  updateLoginStatus();

  // 加入定期檢查登入狀態，與主頁面同步
  const loginCheckInterval = setInterval(updateLoginStatus, 5000);

  // 清理計時器
  onBeforeUnmount(() => {
    clearInterval(loginCheckInterval);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  background-color: transparent;
  box-shadow: none;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-radius: 8px;
    padding: 0 20px; // 統一padding，不依賴Nav_container

    &--scrolled {
      background-color: rgba(158, 174, 192, 0.25);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 1px 1px 5px rgba(158, 174, 192, 0.8);
    }

    @media (max-width: 1600px) {
      padding: 0 15px;
    }

    @media (max-width: 1200px) {
      padding: 0 12px;
    }

    @media (max-width: 768px) {
      padding: 0 10px;
    }

    @media (max-width: 480px) {
      padding: 0 8px;
    }
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 0; // 改為上下padding
    transition: all 0.3s ease;
    background-color: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    flex-shrink: 0;

    @media (max-width: 1100px) {
      gap: 8px;
    }

    @media (max-width: 768px) {
      gap: 6px;
    }

    @media (max-width: 480px) {
      gap: 4px;
    }
  }

  &__pet-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 8px;
    padding: 4px;
    flex-shrink: 0;

    &:hover {
      background: rgba(158, 174, 192, 0.1);
      box-shadow: 0 2px 8px rgba(158, 174, 192, 0.2);
    }
    @media (max-width: 480px) {
      display: none;
    }

    &-image {
      height: 40px;
      width: auto;
      object-fit: contain;
      transition: all 0.3s ease;

      @media (max-width: 1100px) {
        height: 35px;
      }

      @media (max-width: 768px) {
        height: 30px;
      }

      @media (max-width: 480px) {
        height: 25px;
      }
    }
  }

  &__udn-logo {
    max-width: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    border-radius: 8px;
    padding: 4px;
    flex-shrink: 0;

    &:hover {
      background: rgba(158, 174, 192, 0.1);
      box-shadow: 0 2px 8px rgba(158, 174, 192, 0.2);
    }

    &-image {
      height: 40px;
      width: 100%;
      object-fit: contain;
      transition: all 0.3s ease;

      @media (max-width: 1100px) {
        height: 35px;
      }

      @media (max-width: 768px) {
        height: 30px;
      }

      @media (max-width: 480px) {
        height: 25px;
      }
    }
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 4px 0;
    transition: all 0.3s ease;
    background-color: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    flex-shrink: 1;
    min-width: 0;

    @media (max-width: 1200px) {
      gap: 12px;
    }

    @media (max-width: 992px) {
      gap: 8px;
    }

    @media (max-width: 768px) {
      gap: 8px;
    }

    @media (max-width: 480px) {
      gap: 4px;
    }
  }

  &__logout {
    background: linear-gradient(135deg, #9eaec0 0%, #8a9ba8 100%);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(158, 174, 192, 0.3);
    white-space: nowrap;
    min-width: 60px;
    flex-shrink: 0;

    &:hover {
      box-shadow: 0 4px 12px rgba(158, 174, 192, 0.4);
      background: linear-gradient(135deg, #8a9ba8 0%, #9eaec0 100%);
    }

    @media (max-width: 992px) {
      padding: 6px 12px;
      min-width: 55px;
    }

    @media (max-width: 768px) {
      padding: 5px 10px;
      min-width: 50px;
    }

    @media (max-width: 480px) {
      padding: 4px 8px;
      min-width: 45px;
    }
  }

  &__links {
    display: flex;
    align-items: center;
    white-space: nowrap;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &__link {
    color: #000;
    text-decoration: none;
    font-size: 16px;
    font-weight: 300;
    transition: all 0.3s ease;
    position: relative;
    padding: 10px 16px;
    border-radius: 12px;
    white-space: nowrap;

    @media (max-width: 900px) {
      padding: 8px 12px;
    }

    @media (max-width: 800px) {
      padding: 6px 10px;
    }

    &:first-child {
      margin-right: 4px;
      @media (max-width: 992px) {
        margin-right: 0px;
      }
    }
    &:last-child {
      margin-left: 4px;
      @media (max-width: 992px) {
        margin-left: 0px;
      }
    }
    &:nth-child(2) {
      margin: 0 4px;
      @media (max-width: 992px) {
        margin: 0px;
      }
    }

    &:not(&--dropdown):hover {
      color: #fff;
      background: linear-gradient(135deg, #9eaec0 0%, #8a9ba8 100%);
      box-shadow: 0 8px 20px rgba(158, 174, 192, 0.5);
    }

    &--dropdown {
      display: flex;
      align-items: center;
      justify-content: center; // 添加水平居中
      gap: 4px;
      cursor: pointer;
      padding: 10px 16px;
      border-radius: 12px;

      @media (max-width: 900px) {
        padding: 8px 12px;
        gap: 3px;
      }

      @media (max-width: 800px) {
        padding: 6px 10px;
        gap: 2px;
      }

      &:hover {
        color: #fff;
        background: linear-gradient(135deg, #9eaec0 0%, #8a9ba8 100%);
        box-shadow: 0 8px 20px rgba(158, 174, 192, 0.5);
      }
    }

    &--button {
      font-family: inherit;

      &:hover {
        color: #fff;
        background: linear-gradient(135deg, #9eaec0 0%, #8a9ba8 100%);
        box-shadow: 0 8px 20px rgba(158, 174, 192, 0.5);
      }

      &:focus {
        outline: 2px solid rgba(158, 174, 192, 0.5);
        outline-offset: 2px;
        border-radius: 4px;
      }
    }

    &:active {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(158, 174, 192, 0.4);
    }
  }

  &__dropdown {
    position: relative;
    display: inline-block;

    &-arrow {
      transition: transform 0.3s ease;

      &--open {
        transform: rotate(180deg);
      }
    }

    &-menu {
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(
        135deg,
        rgba(158, 174, 192, 0.95) 0%,
        rgba(138, 155, 168, 0.95) 100%
      );
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 8px 0;
      margin-top: 8px;
      min-width: 180px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      opacity: 0;
      visibility: hidden;
      transform: translateX(-50%) translateY(-10px);
      transition: all 0.3s ease;
      z-index: 1000;
      overflow: hidden;

      &--mobile-show {
        opacity: 1;
        visibility: visible;
        transform: translateX(-50%) translateY(0);
      }
    }

    &-item {
      display: block;
      padding: 12px 20px;
      color: white;
      text-decoration: none;
      font-size: 16px;
      font-weight: 400;
      transition: all 0.3s ease;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      margin: 0;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: rgba(212, 197, 169, 0.3);
        color: #fff;
        padding-left: 24px;
      }
    }
  }

  &__social {
    display: flex;
    gap: 16px;
    flex-shrink: 0;

    @media (max-width: 992px) {
      gap: 12px;
    }

    @media (max-width: 480px) {
      gap: 8px;
    }

    &-link {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      transition: all 0.3s ease;

      @media (max-width: 992px) {
        width: 35px;
        height: 35px;
      }

      @media (max-width: 480px) {
        width: 30px;
        height: 30px;
      }

      &:hover {
        transform: scale(1.1);
      }
    }

    &-icon {
      width: 36px;
      height: 36px;

      @media (max-width: 992px) {
        width: 30px;
        height: 30px;
      }
    }
  }

  &__hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    cursor: pointer;
    z-index: 110;
    position: relative;
    flex-shrink: 0;

    @media (max-width: 768px) {
      display: flex;
    }

    &-line {
      display: block;
      height: 3px;
      width: 25px;
      background-color: #000;
      border-radius: 2px;
      margin: 2.5px 0;
      transition: all 0.4s cubic-bezier(0.68, -0.6, 0.32, 1.6);
      transform-origin: center;
    }

    &--active {
      .navbar__hamburger-line {
        &:nth-child(1) {
          transform: rotate(45deg) translate(6px, 6px);
        }

        &:nth-child(2) {
          opacity: 0;
          transform: scale(0);
        }

        &:nth-child(3) {
          transform: rotate(-45deg) translate(6px, -6px);
        }
      }
    }
  }

  &__backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: linear-gradient(
      135deg,
      rgba(27, 3, 62, 0.6),
      rgba(158, 174, 192, 0.4)
    );
    backdrop-filter: blur(5px) saturate(150%);
    -webkit-backdrop-filter: blur(5px) saturate(150%);
    z-index: 98;
    opacity: 0;
    animation: backdropFadeIn 0.3s ease-out forwards;
  }
}

@keyframes backdropFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .navbar {
    &__content {
      position: relative;
      z-index: 102;
    }

    &__logo {
      position: relative;
      z-index: 1000;
    }

    &__right {
      gap: 8px;
      position: relative;
      z-index: 102;
    }

    &__hamburger {
      display: flex;
      position: relative;
      z-index: 103;
    }

    &__links {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      width: 100vw;
      height: auto;
      min-height: 50vh;
      background: linear-gradient(
        135deg,
        rgba(27, 3, 62, 0.85),
        rgba(158, 174, 192, 0.75)
      );
      backdrop-filter: blur(15px) saturate(100%);
      -webkit-backdrop-filter: blur(15px) saturate(100%);
      border-radius: 0 0 10px 10px;
      padding: 80px 20px 40px;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      gap: 2rem;
      box-shadow: 0 8px 32px rgba(27, 3, 62, 0.4);
      z-index: 101;
      box-sizing: border-box;
      margin: 0;
      transform: translateY(-100%);
      opacity: 0;
      visibility: hidden;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      display: flex;

      &--active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
    }

    &__link {
      color: #fff;
      font-size: 22px;
      font-weight: 400;
      padding: 15px 30px;
      text-align: center;
      width: auto;
      border: none;
      border-radius: 16px;
      margin: 8px 0;
      min-width: 200px;

      &:hover {
        color: #fff;
        background: linear-gradient(135deg, #d4c5a9 0%, #9eaec0 100%);
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(212, 197, 169, 0.4);
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      &:not(:last-child)::after {
        display: none;
      }
    }

    &__dropdown {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      &-menu {
        position: static;
        transform: none;
        margin-top: 15px;
        width: 90%;
        max-width: 280px;
        overflow: hidden;
        border-radius: 12px;

        &::before {
          display: none;
        }
      }

      &-item {
        padding: 15px 25px;
        font-size: 18px;
        text-align: center;
      }
    }
  }
}

@media (max-width: 480px) {
  .navbar {
    &__content {
      padding: 0 3px;
    }

    &__links {
      padding: 70px 15px 30px;
      min-height: 45vh;

      &--active {
        transform: translateY(0);
      }
    }

    &__link {
      font-size: 20px;
      padding: 12px 25px;
      min-width: 180px;
    }
  }
}
</style>
