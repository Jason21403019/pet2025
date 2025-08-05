<template>
  <div class="prize">
    <!-- 標題區塊 -->
    <div class="prize__title">
      <img
        src="/imgs/prize_title.png"
        alt="禮品區塊"
        class="prize__title-img"
      />
    </div>

    <!-- 禮品展示區域 -->
    <div class="prize__items">
      <div v-for="(item, index) in prizeItems" :key="index" class="prize__item">
        <div class="prize__item-image">
          <img
            :src="`./imgs/prize${index + 1}.png`"
            :alt="item.alt"
            :class="`prize__image prize__image--${index + 1}`"
          />
        </div>
        <div class="prize__item-text">
          <div class="prize__item-text-top">{{ item.title }}</div>
          <div class="prize__item-text-bottom">{{ item.subtitle }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const prizeItems = [
  {
    title: "汪喵精選",
    subtitle: "一年份貓砂",
    alt: "汪喵精選一年份貓砂",
  },
  {
    title: "汪喵精選",
    subtitle: "一年份尿布墊",
    alt: "汪喵精選一年份尿布墊",
  },
  {
    title: "榮獲IF設計獎",
    subtitle: "多功能緩衝牽繩",
    alt: "榮獲IF設計獎多功能緩衝牽繩",
  },
  {
    title: "汪喵商城",
    subtitle: "購物金$100",
    alt: "汪喵商城購物金$100",
  },
];
</script>

<style lang="scss" scoped>
.prize {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1024px) {
    padding-top: 100px;
  }

  @media (max-width: 768px) {
    padding: 100px 12px 0 12px;
  }

  @media (max-width: 480px) {
    padding: 50px 12px 0 12px;
  }

  &__title {
    text-align: center;
  }

  &__title-img {
    display: block;
    width: 100%;
    max-width: 290px;
    height: auto;

    @media (max-width: 1024px) {
      max-width: 200px;
    }

    @media (max-width: 768px) {
      max-width: 300px;
    }

    @media (max-width: 480px) {
      max-width: 200px;
    }
  }

  &__items {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-top: 25px;
    flex-wrap: wrap;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
    }
  }

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    transition: all 0.3s ease;

    &:first-child {
      margin-left: 0;
    }

    // 第二張圖片（窄的）
    &:nth-child(2) {
      margin-left: -50px;
    }

    // 第三張圖片（寬的）
    &:nth-child(3) {
      margin-left: -30px;
    }

    // 第四張圖片（窄的）
    &:nth-child(4) {
      margin-left: -40px;
    }

    @media (max-width: 768px) {
      flex-direction: column;
      margin-left: 0 !important;
      margin-top: 20px;
      align-items: center;
      width: 100%;
      display: flex;
      justify-content: center;

      &:first-child {
        margin-top: 0;
        align-items: center;
        justify-content: center;

        .prize__image {
          margin-left: 20px;
        }
      }

      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(4) {
        margin-left: 0 !important;
      }
    }

    &:hover {
      transform: translateY(-5px);
    }

    &-image {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      margin-bottom: 10px;

      @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
        align-items: center;
      }
    }

    &-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      line-height: 1.2;
      color: #2f75c9;

      &-top {
        font-size: 22px;
        font-weight: 500;

        @media (max-width: 1024px) {
          font-size: 18px;
        }

        @media (max-width: 768px) {
          font-size: 24px;
        }

        @media (max-width: 480px) {
          font-size: 20px;
        }

        @media (max-width: 360px) {
          font-size: 18px;
        }
      }

      &-bottom {
        font-size: 22px;
        font-weight: 700;

        @media (max-width: 1024px) {
          font-size: 18px;
        }

        @media (max-width: 768px) {
          font-size: 24px;
        }

        @media (max-width: 480px) {
          font-size: 20px;
        }

        @media (max-width: 360px) {
          font-size: 18px;
        }
      }
    }
  }

  &__image {
    object-fit: contain;
    transition: all 0.3s ease;
    display: block;

    &:hover {
      transform: scale(1.05);
    }

    // 第一張圖片 - 貓砂 (284x240)
    &--1 {
      width: 289.5601px;
      height: 207.6921px;
    }

    // 第二張圖片 - 尿布墊 (202.69x246.13)
    &--2 {
      width: 202.6921px;
      height: 246.1261px;
    }

    // 第三張圖片 - 牽繩 (289.56x202.69)
    &--3 {
      width: 289.5601px;
      height: 207.6921px;
    }

    // 第四張圖片 - 購物金 (202.69x246.13)
    &--4 {
      width: 202.6921px;
      height: 246.1261px;
    }
  }
}
</style>
