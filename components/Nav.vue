<template>
  <nav class="navbar">
    <Nav_container>
      <div
        class="navbar__content"
        :class="{ 'navbar__content--scrolled': isScrolled }"
      >
        <!-- 左邊: Logo區域 -->
        <div class="navbar__left">
          <NuxtLink
            to="https://udn.com/news/index"
            target="_blank"
            class="navbar__udn-logo"
          >
            <img
              src="/imgs/udn_logo.svg"
              alt="udn_Logo"
              class="navbar__udn-logo-image"
            />
          </NuxtLink>
          <div class="navbar__pet-logo">
            <img
              src="/imgs/petBlog_logo.svg"
              alt="petBlog_Logo"
              class="navbar__pet-logo-image"
            />
          </div>
        </div>

        <!-- 中間: 導航連結區域 (桌機版) -->
        <div class="navbar__center">
          <button
            @click="logout"
            class="navbar__logout"
            aria-label="登出"
            v-if="isLoggedIn"
          >
            登出
          </button>
          <NuxtLink to="/" class="navbar__link">首頁</NuxtLink>
          <NuxtLink to="#activity" class="navbar__link">活動辦法</NuxtLink>
        </div>

        <!-- 右邊: Social Links -->
        <div class="navbar__right">
          <a
            href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Flab-event.udn.com%2Fbd_pet2025"
            target="_blank"
            class="navbar__social-link navbar__social-link--facebook"
            aria-label="分享到臉書"
          >
            <img
              src="/imgs/fb_logo.svg"
              alt="fb_Logo"
              class="navbar__social-icon"
            />
          </a>
          <a
            href="https://social-plugins.line.me/lineit/share?url=https%3A%2F%2Flab-event.udn.com%2Fbd_pet2025&text=%E5%BF%AB%E4%BE%86%E5%B9%B8%E7%A6%8F%E8%8A%B1%E7%81%AB%E8%BD%89%E4%B8%80%E5%A4%8F%EF%BC%81%E7%9C%8B%E7%9C%8B%E4%BD%A0%E6%9C%83%E6%8A%BD%E5%88%B0%E4%BB%80%E9%BA%BA%E7%85%99%E7%81%AB%EF%BC%81"
            target="_blank"
            class="navbar__social-link navbar__social-link--line"
            aria-label="分享到LINE"
          >
            <img
              src="/imgs/line_logo.svg"
              alt="line_Logo"
              class="navbar__social-icon"
            />
          </a>
        </div>
      </div>

      <!-- 手機版: 導航連結區域 -->
      <div class="navbar__mobile-nav">
        <button
          @click="logout"
          class="navbar__logout navbar__logout--mobile"
          aria-label="登出"
          v-if="isLoggedIn"
        >
          登出
        </button>
        <NuxtLink to="/" class="navbar__link navbar__link--mobile"
          >首頁</NuxtLink
        >
        <NuxtLink to="#activity" class="navbar__link navbar__link--mobile"
          >活動辦法</NuxtLink
        >
      </div>
    </Nav_container>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject } from "vue";

const isScrolled = ref(false);
const scrollThreshold = 40;

// 使用注入的登入狀態和方法
const isLoggedIn = inject("isLoggedIn", ref(false));
const updateLoginStatus = inject("updateLoginStatus", () => {});
const performCompleteLogout = inject("performCompleteLogout", () => {});

function handleScroll() {
  isScrolled.value = window.scrollY > scrollThreshold;
}

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
  updateLoginStatus();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  flex-direction: column;
  background-color: transparent;
  box-shadow: none;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  position: sticky;
  top: 0;
  z-index: 100;

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    border-radius: 8px;

    &--scrolled {
      background-color: rgba(158, 174, 192, 0.25);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: 1px 1px 5px rgba(158, 174, 192, 0.8);
    }
  }

  // 左邊Logo區域
  &__left {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 0;
    transition: all 0.3s ease;
    flex-shrink: 0;

    @media (max-width: 1100px) {
      gap: 8px;
    }

    @media (max-width: 768px) {
      gap: 6px;
    }

    @media (max-width: 480px) {
      gap: 0px;
    }
  }

  // 中間導航區域 (桌機版)
  &__center {
    display: flex;
    align-items: center;
    gap: 36px;
    flex-grow: 1;
    justify-content: center;
    // margin-right: 11rem;

    @media (max-width: 992px) {
      gap: 16px;
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  // 右邊Social區域 - 移除 padding-right，因為現在由外層處理
  &__right {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
    padding-right: 12px;

    @media (max-width: 992px) {
      gap: 12px;
    }

    @media (max-width: 480px) {
      gap: 8px;
    }
  }

  // 手機版導航區域
  &__mobile-nav {
    display: none;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 16px;

    @media (max-width: 768px) {
      display: flex;
    }

    @media (max-width: 480px) {
      padding: 8px;
      gap: 12px;
    }
  }

  // Logo樣式
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

    &-image {
      height: 40px;
      width: auto;
      object-fit: contain;
      transition: all 0.3s ease;

      @media (max-width: 1100px) {
        height: 35px;
      }

      @media (max-width: 768px) {
        height: 26px;
      }

      @media (max-width: 480px) {
        height: 24px;
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
        height: 30px;
      }
    }
  }

  // 登出按鈕
  &__logout {
    background: transparent;
    color: #2f75c9;
    border: 2px solid #2f75c9;
    padding: 8px 24px;
    border-radius: 30px;
    font-size: 16px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
    min-width: 60px;
    flex-shrink: 0;

    &:hover {
      background: #2f75c9;
      color: #fbed1d;
      border-color: #2f75c9;
    }

    @media (max-width: 992px) {
      padding: 6px 12px;
      min-width: 55px;
    }

    &--mobile {
      max-width: 200px;
      flex-shrink: 1;
    }
  }

  // 導航連結
  &__link {
    color: #2f75c9;
    text-decoration: none;
    font-size: 16px;
    font-weight: 400;
    transition: all 0.3s ease;
    position: relative;
    padding: 8px 24px;
    border-radius: 30px;
    white-space: nowrap;
    border: 2px solid #2f75c9;
    min-width: 60px;
    text-align: center;
    background: transparent;

    @media (max-width: 900px) {
      padding: 8px 12px;
    }

    &:hover {
      color: #fbed1d;
      background: #2f75c9;
      border-color: #2f75c9;
    }

    &:active {
      transform: translateY(-1px);
    }

    &--mobile {
      max-width: 200px;
      text-align: center;
      flex-shrink: 1;

      &:hover {
        color: #fbed1d;
        background: #2f75c9;
        transform: scale(1.02);
      }
    }
  }

  // Social Links
  &__social-link {
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

  // Social Icons
  &__social-icon {
    width: 36px;
    height: 36px;

    @media (max-width: 992px) {
      width: 30px;
      height: 30px;
    }

    @media (max-width: 768px) {
      width: 30px;
      height: 30px;
    }

    @media (max-width: 480px) {
      width: 30px;
      height: 30px;
    }
  }
}
</style>
