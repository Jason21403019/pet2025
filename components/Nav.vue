<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': isScrolled }">
    <Nav_container>
      <div class="navbar__content">
        <div class="navbar__left">
          <a
            href="https://udn.com/news/index"
            target="_blank"
            rel="noopener noreferrer"
            class="navbar__udn-logo"
          >
            <img
              src="/imgs/udn_logo.svg"
              alt="udn_Logo"
              class="navbar__udn-logo-image"
            />
          </a>

          <div class="navbar__pet-logo">
            <a
              href="https://pets.udn.com/pets/index"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/imgs/petBlog_logo.svg"
                alt="petBlog_Logo"
                class="navbar__pet-logo-image"
              />
            </a>
          </div>
        </div>

        <div class="navbar__center">
          <button
            @click="logout"
            class="navbar__logout"
            aria-label="登出"
            v-if="isLoggedIn"
          >
            登出
          </button>
          <NuxtLink to="/" class="navbar__link" @click="goHome">首頁</NuxtLink>
          <NuxtLink to="#activity" class="navbar__link">活動辦法</NuxtLink>
        </div>

        <div class="navbar__right">
          <a
            href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fevent.udn.com%2Fbd_petsqa_2025"
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
            href="https://social-plugins.line.me/lineit/share?url=https%3A%2F%2Fevent.udn.com%2Fbd_petsqa_2025&text=%E5%A6%82%E6%9E%9C%E6%AF%9B%E5%AD%A9%E6%9C%83%E8%AA%AA%E8%A9%B1%EF%BC%8C%E7%89%A0%E6%9C%83%E7%88%86%E6%96%99%E4%BD%A0%E6%80%8E%E9%BA%BC%E5%AF%B5%E7%89%A0%E5%97%8E%EF%BC%9F%F0%9F%98%BC%F0%9F%90%B6%20%E8%81%AF%E5%90%88%E6%96%B0%E8%81%9E%E7%B6%B2%E5%AF%B5%E7%89%A9%E9%83%A8%E8%90%BD%E9%A3%BC%E4%B8%BB%E8%81%B2%E9%9F%B3%E5%A4%A7%E8%AA%BF%E6%9F%A5%EF%BC%81"
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

      <div class="navbar__mobile-nav">
        <button
          @click="logout"
          class="navbar__logout navbar__logout--mobile"
          aria-label="登出"
          v-if="isLoggedIn"
        >
          登出
        </button>
        <NuxtLink
          to="/"
          class="navbar__link navbar__link--mobile"
          @click="goHome"
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
import { useRoute } from "vue-router";

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

const route = useRoute();

function goHome(e) {
  if (route.path === "/") {
    e.preventDefault();
    scrollToBanner();
  }
}

function scrollToBanner() {
  const bannerElement = document.querySelector(".banner");
  if (bannerElement) {
    bannerElement.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  } else {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
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
  border-radius: 8px;
  transition: all 0.3s ease;

  &--scrolled {
    background-color: rgba(168, 168, 168, 0.2);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
    box-shadow: 1px 1px 5px rgba(158, 174, 192, 0.2);
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
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
      gap: 4px;
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
    margin-right: 16rem;
    @media (max-width: 1200px) {
      margin-right: 7rem;
    }
    @media (max-width: 1000px) {
      margin-right: 0rem;
    }

    @media (max-width: 992px) {
      gap: 16px;
    }

    @media (max-width: 768px) {
      display: none;
    }
  }

  // 右邊Social區域
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
    padding: 4px;
    flex-shrink: 0;

    &-image {
      height: 40px;
      width: auto;
      object-fit: contain;

      @media (max-width: 1100px) {
        height: 35px;
      }

      @media (max-width: 768px) {
        height: 26px;
      }

      @media (max-width: 480px) {
        height: 28px;
      }
    }

    a {
      display: inline-block;
      transition: opacity 0.2s ease;

      &:hover {
        opacity: 0.8;
      }
    }
  }

  &__udn-logo {
    max-width: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    padding: 4px;
    flex-shrink: 0;

    &-image {
      height: 40px;
      width: 100%;
      object-fit: contain;

      @media (max-width: 1100px) {
        height: 35px;
      }

      @media (max-width: 768px) {
        height: 30px;
      }

      @media (max-width: 480px) {
        height: 32px;
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
    min-width: 110px;
    flex-shrink: 0;
    line-height: inherit;

    &:hover {
      background: #2f75c9;
      color: #fbed1d;
      border-color: #2f75c9;
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
    width: 36px;
    height: 36px;
    border-radius: 50%;
    transition: all 0.3s ease;
    @media (max-width: 460px) {
      width: 32px;
      height: 32px;
    }

    &:hover {
      transform: scale(1.1);
    }
  }

  // Social Icons
  &__social-icon {
    width: 36px;
    height: 36px;
    @media (max-width: 460px) {
      width: 32px;
      height: 32px;
    }
  }
}
</style>
